let editor = ace.edit("editor"),
    editorDOM = document.getElementById('editor'),
    folder,
    files,
    current,
    treeData = [],
    treeDOM = $('#folder'),
    language = 'html',
    blankMessage = document.getElementById('blank-message');

window.onerror = function(error){
    if (error.match(/Maximum call stack size exceeded/g)){
        notification('Klasör dosya sayısı büyük olduğu için listelenemiyor, büyük ihtimalle kullandığım tree eklentisi yüzünden bu arada.', 'error', 5);
    }
};

editor.setTheme("ace/theme/monokai");
editor.setOptions({
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: true,
    enableEmmet: true,
    showLineNumbers: false
});

const notification = (msg, className = null, seconds = 1) => {

    let old_div = document.querySelector('.alert');
    if (old_div) {
        old_div.parentNode.removeChild(old_div);
    }

    let div = document.createElement('div');
    div.className = 'alert ' + className;
    div.innerHTML = msg;
    document.body.appendChild(div);

    setTimeout(() => div.classList.add('active'), 1);
    setTimeout(() => div.classList.remove('active'), (seconds * 1000));

}

const openFolder = async () => {
    folder = await window.showDirectoryPicker();
    files = await getFiles(folder);

    blankMessage.style.display = 'none';
    editorDOM.style.display = 'block';

    notification(folder.name + ' klasörü açıldı.');

    treeDOM
        .on('changed.jstree', (e, data) => readFile(data.node.original))
        .jstree({
            core: {
                data: treeData
            }
        })

}

const getFiles = async (folder, parent = null) => {
    let files = [];
    for await (let entry of folder.getEntries()) {
        if (entry.isFile) {
            files.push(entry);
        } else {
            files.push(getFiles(entry, entry.name));
        }

        let icon = 'folder.png';
        if (entry.name.match(/\.css/g)) {
            icon = 'css.png';
            language = 'css';
        } else if (entry.name.match(/\.js/g)) {
            icon = 'js.png';
            language = 'javascript';
        } else if (entry.name.match(/\.html/g)) {
            icon = 'html.png';
        } else if (entry.name.match(/\.php/g)) {
            language = 'php';
        } else if (entry.isFile) {
            icon = 'file.png';
        }

        editor.session.setMode("ace/mode/" + language);

        treeData.push({
            id: entry.name,
            parent: parent ?? '#',
            text: entry.name,
            icon: 'img/' + icon
        });
    }
    return [...(await Promise.all(files)).flat()];
}

const readFile = (data) => {
    files.forEach(async (value, key) => {
        if (value.name == data.id) {
            current = value;
            let file = await value.getFile();
            let content = await file.text();
            editor.setValue(content);
        }
    });
}

const saveFile = async () => {
    let writable = await current.createWritable();
    await writable.write(editor.getValue());
    notification(current.name + ' dosyası kaydedildi.');
    writable.close();
}

const newFile = async () => {
    if (folder) {
        current = await window.showSaveFilePicker();
        notification(current.name + ' dosyası oluşturuldu.');
        await reloadTree();
    } else {
        notification('Dosya oluşturmak için önce  klasör açın.', 'error');
    }
}

const reloadTree = async () => {
    treeData = [];
    files = await getFiles(folder);

    treeDOM.jstree().destroy()

    treeDOM
        .on('changed.jstree', (e, data) => readFile(data.node.original))
        .jstree({
            core: {
                data: treeData
            }
        })
}

window.addEventListener('keydown', e => {
    if (e.key === 's' && e.metaKey) {
        e.preventDefault();
        saveFile();
    } else if (e.key === 'o' && e.metaKey) {
        e.preventDefault();
        openFolder();
    }
});
