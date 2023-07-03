/* globals zip, document, URL, MouseEvent, AbortController, alert */
(() => {

	const INFLATE_IMPLEMENTATIONS = {
		"zip.js": ["lib/z-worker.js"],
		"fflate": ["lib/z-worker-fflate.js", "fflate.min.js"],
		"pako": ["lib/z-worker-pako.js", "pako_inflate.min.js"]
	};

	const model = (() => {

		return {
			getEntries(file, options) {
				return (new zip.ZipReader(new zip.BlobReader(file))).getEntries(options);
			},
			async getURL(entry, options) {
				return URL.createObjectURL(await entry.getData(new zip.BlobWriter(), options));
			}
		};

	})();

	(() => {
		var reset = document.querySelector('.reset');
		const appContainer = document.getElementById("container");
		const fileInput = document.getElementById("addfile");
		const encodingInput = document.getElementById("encoding-input");
		const passwordInput = document.getElementById("password-input");
		const inflateImplementationInput = document.getElementById("inflate-implementation-input");
		let fileList = document.getElementById("file-list");
		let entries;
		let selectedFile;
		passwordInput.onchange = async () => fileList.querySelectorAll("a[download]").forEach(anchor => anchor.download = "");
		fileInput.onchange = selectFile;	
		encodingInput.onchange = selectEncoding;
		inflateImplementationInput.onchange = selectInflateImplementation;
		appContainer.onclick = downloadFile;
		selectInflateImplementation();

		reset.addEventListener('click', () => {
			fileInput.value = "";
			document.querySelector('#file-list').innerText = "";
			fileList.style.height = "5vh"
		})

		async function downloadFile(event) {
			const target = event.target;
			let href = target.getAttribute("href");
			if (target.dataset.entryIndex !== undefined && !target.download && !href) {
				target.removeAttribute("href");
				event.preventDefault();
				try {
					await download(entries[Number(target.dataset.entryIndex)], target.parentElement.parentElement, target);
					href = target.getAttribute("href");
				} catch (error) {
					alert(error);
				}
				target.setAttribute("href", href);
			}
		}

		async function selectFile() {
			try {
				encodingInput.disabled = true;
				selectedFile = fileInput.files[0];
				await loadFiles();
			} catch (error) {
				alert(error);
			} finally {
				fileInput.value = "";
			}
		}

		async function selectEncoding() {
			try {
				encodingInput.disabled = true;
				await loadFiles(encodingInput.value);
			} catch (error) {
				alert(error);
			}
		}

		function selectInflateImplementation() {
			const inflateImplementation = INFLATE_IMPLEMENTATIONS[inflateImplementationInput.value];
			zip.configure({ workerScripts: { inflate: inflateImplementation } });
		}

		async function loadFiles(filenameEncoding) {
			fileList.style.height = "auto";
			entries = await model.getEntries(selectedFile, { filenameEncoding });
			if (entries && entries.length) {
				fileList.classList.remove("empty");
				const filenamesUTF8 = Boolean(!entries.find(entry => !entry.filenameUTF8));
				const encrypted = Boolean(entries.find(entry => entry.encrypted));
				encodingInput.value = filenamesUTF8 ? "utf-8" : filenameEncoding || "cp437";
				encodingInput.disabled = filenamesUTF8;
				passwordInput.value = "";
				passwordInput.disabled = !encrypted;
				refreshList();
			}
		}

		function refreshList() {
			const newFileList = fileList.cloneNode();
			entries.forEach((entry, entryIndex) => {
				const li = document.createElement("li");
				const filenameContainer = document.createElement("div");
				const filename = document.createElement("a");
				filenameContainer.classList.add("filename-container");
				li.appendChild(filenameContainer);
				filename.classList.add("filename");
				filename.dataset.entryIndex = entryIndex;
				filename.textContent = filename.title = entry.filename;
				// filename.style.textDecoration = "none";
				// filename.style.color = "white";

				filename.title = `${entry.filename}\n  Last modification date: ${entry.lastModDate.toLocaleString()}`;
				if (!entry.directory) {
					filename.href = "";
					filename.title += `\n  Uncompressed size: ${entry.uncompressedSize.toLocaleString()} bytes`;
				}
				filenameContainer.appendChild(filename);
				newFileList.appendChild(li);
			});
			fileList.replaceWith(newFileList);
			fileList = newFileList;

		}

		async function download(entry, li, a) {
			if (!li.classList.contains("busy")) {
				const unzipProgress = document.createElement("progress");
				li.appendChild(unzipProgress);
				const controller = new AbortController();
				const signal = controller.signal;
				const abortButton = document.createElement("button");
				abortButton.onclick = () => controller.abort();
				abortButton.textContent = "✖";
				abortButton.title = "Abort";
				li.querySelector(".filename-container").appendChild(abortButton);
				li.classList.add("busy");
				try {
					const blobURL = await model.getURL(entry, {
						password: passwordInput.value,
						onprogress: (index, max) => {
							unzipProgress.value = index;
							unzipProgress.max = max;
						},
						signal
					});

					a.href = blobURL;
					a.download = entry.filename;
					const clickEvent = new MouseEvent("click");
					a.dispatchEvent(clickEvent);
				} catch (error) {
					if (error.message != zip.ERR_ABORT) {
						throw error;
					}
				} finally {
					li.classList.remove("busy");
					unzipProgress.remove();
					abortButton.remove();
				}
			}
		}

	})();

})();
