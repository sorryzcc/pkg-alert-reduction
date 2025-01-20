const ExcelJS = require('exceljs');

// 定义一个异步函数来读取 Excel 文件
async function readExcel(filePath) {
    // 创建一个新的工作簿实例并读取文件
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    // 获取第一个工作表
    const worksheet = workbook.worksheets[0];

    // 如果没有找到工作表，则返回
    if (!worksheet) {
        console.log("未找到工作表");
        return;
    }

    // 遍历每一行并打印其值
    worksheet.eachRow((row, rowNumber) => {
        console.log(`第 ${rowNumber} 行: ${row.values}`);
    });
}

// 调用函数并传入 Excel 文件路径
readExcel('Configurations.xlsx')
    .then(() => console.log("读取完成"))
    .catch(error => console.error("读取文件时出错: ", error));