document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.querySelector('.gallery');

    function displayUploadedFiles() {
        gallery.innerHTML = '';
        const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
        let row;

        uploadedFiles.forEach((file, index) => {
            if (index % 2 === 0) {
                // Create a new row every two files
                row = document.createElement('div');
                row.classList.add('row');
                gallery.appendChild(row);
            }

            const fileContainer = document.createElement('div');
            fileContainer.classList.add('col-lg-6', 'col-md-6');
            fileContainer.style.marginBottom = '20px';
            
            const courseItem = document.createElement('div');
            courseItem.classList.add('course-item');
            
            const positionRelative = document.createElement('div');
            positionRelative.classList.add('position-relative', 'overflow-hidden');
            
            if (file.type === 'image') {
                const img = document.createElement('img');
                img.classList.add('img-fluid');
                img.src = file.content;
                img.alt = file.name;
                img.style.maxWidth = '600px'; // Maximum width
                img.style.width = '100%'; // Full width of the column
                img.style.height = 'auto'; // Maintain aspect ratio
                positionRelative.appendChild(img);
            } else if (file.type === 'video') {
                const video = document.createElement('video');
                video.src = file.content;
                video.controls = true;
                positionRelative.appendChild(video);
            } else if (file.type === 'application' && file.name.endsWith('.pdf')) {
                const iframe = document.createElement('iframe');
                iframe.src = file.content;
                iframe.classList.add('pdf-viewer');
                positionRelative.appendChild(iframe);
            } else {
                const link = document.createElement('a');
                link.href = file.content;
                link.target = '_blank';
                link.textContent = file.name;
                positionRelative.appendChild(link);
            }
            
            courseItem.appendChild(positionRelative);
            fileContainer.appendChild(courseItem);
            row.appendChild(fileContainer);
        });
    }

    displayUploadedFiles();
});
