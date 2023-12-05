import fs from 'fs'

// 读取package.json文件
fs.readFile('package.json', 'utf8', function(err, data) {
    if (err) {
        console.error(err);
        return;
    }

    // 解析为JSON对象
    let packageObj = JSON.parse(data);

    // 添加新的字段
    packageObj.files = ["dist"];
    packageObj.typings = "./dist/table-naiveui.es.d.ts";
    packageObj.module = "./dist/table-naiveui.es.js";
    packageObj.exports = {
        ".": {
            "types": "./dist/table-naiveui.es.d.ts",
            "import": "./dist/table-naiveui.es.js"
        },
        "./style.css": "./dist/table-naiveui.css"
    };

    // 将JSON对象转换回字符串
    let updatedData = JSON.stringify(packageObj, null, 2);

    // 写回package.json文件
    fs.writeFile('package.json', updatedData, 'utf8', function(err) {
        if (err) {
            console.error(err);
        } else {
            console.log('package.json has been updated');
        }
    });
});
