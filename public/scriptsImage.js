const photosUpload = {
    input: '',
    uploadLimit: 5,
    preview: document.querySelector('.photos-preview'),
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target;
        photosUpload.input = event.target;

        if (photosUpload.hasLimit()) {
            return;
        };

        Array.from(fileList).forEach((file) => {

            photosUpload.files.push(file);

            const reader = new FileReader();

            reader.onload = () => {
                const image = new Image();
                image.src = String(reader.result);

                photosUpload.getContainer(image);

                const div = photosUpload.getContainer(image);

                photosUpload.preview.appendChild(div);

            };

            reader.readAsDataURL(file);
        });

        photosUpload.input.files = photosUpload.getAllFiles();
    },
    hasLimit() {
        const { files: fileList } = event.target;
        const { uploadLimit, input } = photosUpload;
        
        if (fileList.length > uploadLimit) {
            alert(`Você ultrapassou o limite de Envios de Imagem, por favor envie até no máximo ${uploadLimit} imagens.`);
            event.preventDefault();
            return true
        };

        if (photosUpload.files.length + input.files.length > uploadLimit) {
            alert(`Você está tentando enviar uma quantia de imagens que excede o limite de ${uploadLimit} imagens por receita! Remova algumas das imagens e tente novamente.`)
            event.preventDefault();
            return true;
        };
    },
    getContainer(image) {
        const div = document.createElement('div');
        div.classList.add('photos');

        div.onclick = photosUpload.removePhoto;
        
        div.appendChild(image);

        div.appendChild(photosUpload.getRemoveButton());

        return div
    },
    getRemoveButton() {
        const button = document.createElement('i');
        button.classList.add('material-icons');
        button.innerHTML = 'close';
        return button;
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer();

        photosUpload.files.forEach(file => dataTransfer.items.add(file));

        return dataTransfer.files;
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode;
        const photosArray = Array.from(photosUpload.preview.children);
        const index = photosArray.indexOf(photoDiv);

        photosUpload.files.splice(index, 1);
        photosUpload.input.files = photosUpload.getAllFiles();
        
        photoDiv.remove();
    },
    removeOldPhotos() {
        const photoDiv = event.target.parentNode;
        const photoId = photoDiv.id;

        if (photoId) {
            const removedFiles = document.querySelector('input[name="removed_files"]');
            removedFiles.value += `${photoId},`;
        };
        
        photoDiv.remove();
    },
};

const showImage = {
    backgroundUrl: document.querySelector('section.img'),
    handleChangeImage(event) {
        const src = event.target.parentNode.querySelector('img').src;
        showImage.backgroundUrl.style.background = `url(${src}) no-repeat center center / cover`
    },
};

const avatarUpload = {
    avatarPreview: document.querySelector('.avatar-preview'),
    handleInput(event) {        
        avatarUpload.removeOldAvatar();

        const { files } = event.target;

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            
            reader.onload = () => {
                avatarUpload.getContainer(reader.result);
            };

            reader.readAsDataURL(file);
        });
    },
    getContainer(blobUrl) {
        const advisorSpan = document.createElement('span');
        advisorSpan.innerHTML = 'ATENÇÃO: Clicando em "Salvar Chef" você concorda que esta será sua Foto de Perfil!';
        advisorSpan.style.color = 'rgba(237, 55, 55, 0.7)';
        advisorSpan.style.position = "relative";
        advisorSpan.style.top = "15px";

        const image = new Image();
        image.src = String(blobUrl);
        
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('avatarPhoto');

        avatarDiv.append(image);

        avatarUpload.avatarPreview.appendChild(avatarDiv);
        avatarUpload.avatarPreview.appendChild(advisorSpan);
    },
    removeOldAvatar() {
        const oldAvatar = document.querySelector('.avatarPhoto');
        const oldAdvisor = document.querySelector('.avatar-preview span')

        if (oldAvatar) {
            oldAvatar.remove();
            if (oldAdvisor) {
                oldAdvisor.remove();
            };
        };
    },
};