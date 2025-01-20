const ExcelJS = require('exceljs');

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

        // 获取 "基准大小（M）" 和 "责任人" 列的索引
        let colIndexSizeA, colIndexSizeB, colIndexOwnerA;
        worksheetA.getRow(1).eachCell((cell, colNumber) => {
            if (cell.text === '基准大小（M）') colIndexSizeA = colNumber;
            if (cell.text === '责任人') colIndexOwnerA = colNumber;
        });
        worksheetB.getRow(1).eachCell((cell, colNumber) => {
            if (cell.text === '基准大小（M）') colIndexSizeB = colNumber;
        });

        if (!colIndexSizeA || !colIndexSizeB || !colIndexOwnerA) {
            console.log("未找到必要的列");
            return;
        }

        // 创建一个映射以存储 B 表格中 "基准大小（M）" 的值和对应的行号
        const sizeMapB = {};
        worksheetB.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            if (rowNumber > 1 && row.getCell(colIndexSizeB).value !== null) {
                sizeMapB[row.getCell(colIndexSizeB).value] = rowNumber;
            }
        });

        // 比较 A 表格中的 "基准大小（M）" 值与 B 表格中的值
        worksheetA.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            if (rowNumber > 1 && row.getCell(colIndexSizeA).value !== null) {
                const sizeA = parseFloat(row.getCell(colIndexSizeA).text);
                const sizeB = parseFloat(worksheetB.getRow(sizeMapB[sizeA] || 2).getCell(colIndexSizeB).text);

                if (sizeA > sizeB) {
                    console.log(`责任人为：${row.getCell(colIndexOwnerA).text}`);
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