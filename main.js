(async()=>{
    const {importAll} = await import('https://rpgen3.github.io/mylib/export/import.mjs');
    const rpgen3 = await importAll([
        'input',
        'strToImg',
        'imgur'
    ]);
    const {addInputStr, imgur, bufToImg, imgToBuf} = rpgen3;
    const body = $('body').css({
        'text-align': 'center',
        padding: '1em'
    });
    $('<h1>').appendTo(body).text('imgurを汎用アップローダーとして使う裏技');
    $('<input>').appendTo(body).attr({
        type: 'file'
    }).on('change', ({target}) => {
        target.files[0].arrayBuffer();
    });
    const output = $('<div>').appendTo(body);
    const load = async buf => {
        const {id} = await imgur.upload(bufToImg(buf));
        addInputStr(output.empty(),{
            label: 'output',
            copy: true,
            value: id
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
                imgToBuf(await imgur.load(input()))
            ], {type: 'audio/mpeg'}))
        }).get(0).click();
    })
})();
