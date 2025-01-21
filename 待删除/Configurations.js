const ExcelJS = require('exceljs');

// 函数用于清理并转换包含 "M" 的字符串为纯数字
function parseSize(sizeStr) {
    if (typeof sizeStr !== 'string') return parseFloat(sizeStr);
    const cleanedSize = sizeStr.replace(/M/g, '').trim();
    const sizeValue = parseFloat(cleanedSize);
    return isNaN(sizeValue) ? null : sizeValue;
}

async function compareExcelFiles(fileA, fileB) {
    try {
        // 创建工作簿实例并读取文件
        const workbookA = new ExcelJS.Workbook();
        const workbookB = new ExcelJS.Workbook();
        await Promise.all([workbookA.xlsx.readFile(fileA), workbookB.xlsx.readFile(fileB)]);

        // 获取第一个工作表
        const worksheetA = workbookA.worksheets[0];
        const worksheetB = workbookB.worksheets[0];

        if (!worksheetA || !worksheetB) {
            console.log("未找到工作表");
            return;
        }

        // 打印所有列名以确认列名是否正确
        console.log("WorkSheet A Headers:");
        worksheetA.getRow(1).eachCell((cell, colNumber) => {
            console.log(`Column ${colNumber}: ${cell.text}`);
        });
        console.log("WorkSheet B Headers:");
        worksheetB.getRow(1).eachCell((cell, colNumber) => {
            console.log(`Column ${colNumber}: ${cell.text}`);
        });

        // 直接指定列索引（假设 A 表格中 "基准大小（M）" 在 C 列）
        const colIndexSizeA = 3; // C 列

        // 对于 B 表格，仍然尝试通过列名查找 "基准大小（M）" 和 "责任人"
        let colIndexSizeB, colIndexOwnerB;
        const headerRowB = worksheetB.getRow(1);
        headerRowB.eachCell((cell, colNumber) => {
            if (cell.text.trim() === '基准大小（M）') colIndexSizeB = colNumber;
            if (cell.text.trim() === '责任人') colIndexOwnerB = colNumber;
        });

        if (!colIndexSizeB || !colIndexOwnerB) {
            console.error("未在 B 表格中找到必要的列");
            return;
        }

        // 创建一个映射以存储 B 表格中 "基准大小（M）" 的值和对应的 "责任人"
        const sizeToOwnerMap = {};
        worksheetB.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            if (rowNumber > 1 && row.getCell(colIndexSizeB).value !== null) {
                const sizeValue = parseSize(row.getCell(colIndexSizeB).text);
                if (sizeValue !== null) {
                    sizeToOwnerMap[sizeValue] = row.getCell(colIndexOwnerB).text;
                }
            }
        });

        // 比较 A 表格中的 "基准大小（M）" 值与 B 表格中的值
        worksheetA.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            if (rowNumber > 1 && row.getCell(colIndexSizeA).value !== null) {
                const sizeA = parseSize(row.getCell(colIndexSizeA).text);
                if (sizeA !== null) {
                    for (let sizeB in sizeToOwnerMap) {
                        const parsedSizeB = parseFloat(sizeB);
                        if (sizeA > parsedSizeB) {
                            console.log(`责任人为：${sizeToOwnerMap[parsedSizeB]}`);
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error("处理文件时出错: ", error);
    }
}

// 调用函数并传入 Excel 文件路径
compareExcelFiles('2025-01-14-6243820.xlsx', 'Configurations.xlsx')
    .then(() => console.log("对比完成"))
    .catch(error => console.error("读取文件时出错: ", error));