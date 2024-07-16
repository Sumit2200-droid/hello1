document.addEventListener('DOMContentLoaded', function() {
    const loginSection = document.getElementById('loginSection');
    const uploadSection = document.getElementById('uploadSection');
    const fileList = document.getElementById('fileList');
    const gallery = document.querySelector('.gallery');
    const logoutLink = document.getElementById('logout');
    const error = document.getElementById('error');

    const storedUsername = 'ashim';
    const storedPassword = '733124';

    if (localStorage.getItem('loggedin') === 'true') {
        loginSection.classList.add('hidden');
        uploadSection.classList.remove('hidden');
        fileList.classList.remove('hidden');
        logoutLink.classList.remove('hidden');
        displayUploadedFiles();
    }

    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === storedUsername && password === storedPassword) {
            localStorage.setItem('loggedin', 'true');
            loginSection.classList.add('hidden');
            uploadSection.classList.remove('hidden');
            fileList.classList.remove('hidden');
            logoutLink.classList.remove('hidden');
            displayUploadedFiles();
        } else {
            error.textContent = 'Invalid username or password';
        }
    });

    document.getElementById('logout').addEventListener('click', function() {
        localStorage.removeItem('loggedin');
        loginSection.classList.remove('hidden');
        uploadSection.classList.add('hidden');
        fileList.classList.add('hidden');
        logoutLink.classList.add('hidden');
    });

    const uploadForm = document.getElementById('uploadForm');
    uploadForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const fileInput = document.getElementById('fileToUpload');
        const files = fileInput.files;

        if (files.length > 0) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const fileContent = event.target.result;
                    const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
                    uploadedFiles.push({ name: file.name, content: fileContent, type: file.type.split('/')[0] });
                    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
                    displayUploadedFiles();
                };
                reader.readAsDataURL(file);
            });
        }
    });

    function displayUploadedFiles() {
        gallery.innerHTML = '';
        const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
        uploadedFiles.forEach((file, index) => {
            const fileContainer = document.createElement('div');
            fileContainer.style.marginBottom = '20px';

            if (file.type === 'image') {
                const img = document.createElement('img');
                img.src = file.content;
                img.alt = file.name;
                fileContainer.appendChild(img);
            } else if (file.type === 'video') {
                const video = document.createElement('video');
                video.src = file.content;
                video.controls = true;
                fileContainer.appendChild(video);
            } else if (file.type === 'application' && file.name.endsWith('.pdf')) {
                const iframe = document.createElement('iframe');
                iframe.src = file.content;
                iframe.classList.add('pdf-viewer');
                fileContainer.appendChild(iframe);
            } else {
                const link = document.createElement('a');
                link.href = file.content;
                link.target = '_blank';
                link.textContent = file.name;
                fileContainer.appendChild(link);
            }

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', function() {
                const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
                uploadedFiles.splice(index, 1);
                localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
                displayUploadedFiles();
            });
            fileContainer.appendChild(deleteBtn);

            if (file.type === 'image' || file.type === 'video') {
                const downloadBtn = document.createElement('a');
                downloadBtn.textContent = 'Download';
                downloadBtn.classList.add('download-btn');
                downloadBtn.href = file.content;
                downloadBtn.download = file.name;
                fileContainer.appendChild(downloadBtn);
            }

            gallery.appendChild(fileContainer);
        });
    }

    displayUploadedFiles();
});