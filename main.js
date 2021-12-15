(async()=>{
    const {getScript, importAll} = await import('https://rpgen3.github.io/mylib/export/import.mjs');
    await getScript('https://code.jquery.com/jquery-3.3.1.min.js');
    const rpgen3 = await importAll([
        'input',
        'str2img',
        'imgur',
        'util'
    ].map(v => `https://rpgen3.github.io/mylib/export/${v}.mjs`));
    const {getTime, addInputStr, imgur, buf2img, img2buf} = rpgen3;
    const body = $('body').css({
        'text-align': 'center',
        padding: '1em'
    });
    $('<h1>').appendTo(body).text('imgurを汎用アップローダーとして使う裏技');
    $('<h2>').appendTo(body).text('1MB以上はimgurにアップロードすると劣化するのでデコードに失敗します');
    const console = new class {
        constructor(){
            this.elm = $('<span>').appendTo($('<div>').appendTo(body));
        }
        log(...arg){
            return this.elm.text(arg.join(' ') + `(${getTime()})`).css({
                color: 'blue',
                backgroundColor: 'lightblue'
            });
        }
        error(...arg){
            this.log(...arg).css({
                color: 'red',
                backgroundColor: 'pink'
            });
        }
    };
    $('<input>').appendTo(body).attr({
        type: 'file'
    }).on('change', ({target}) => {
        target.files[0].arrayBuffer().then(upload);
    });
    const output = $('<div>').appendTo(body);
    const upload = async buf => {
        const {id, deletehash, token} = await imgur.upload(buf2img(buf));
        addInputStr(output.empty(),{
            label: 'output',
            copy: true,
            value: id
        });
        addInputStr(output,{
            readonly: true,
            title: "削除パス",
            value: `id=${id}&deletehash=${deletehash}&token=${token}`
        });
        $('<button>').appendTo(output).text('削除する').on('click', () => {
            imgur.delete({deletehash, token})
                .then(() => console.log('削除しました'))
                .catch(() => console.error('削除できませんでした'));
        });
        output.append(await imgur.load(id));
    };
    const input = addInputStr(body,{
        label: 'imgurURL'
    });
    $('<button>').appendTo(body).text('ダウンロード').on('click', async () => {
        $('<a>', {
            download: 'test.mp3',
            href: URL.createObjectURL(new Blob([
                img2buf(await imgur.load(input()))
            ], {type: 'audio/mpeg'}))
        }).get(0).click();
    })
})();
