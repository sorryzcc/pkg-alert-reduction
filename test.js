const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 获取今天的日期格式为 YYYY-MM-DD
function getTodayString() {
    const today = new Date();
    return today.toISOString().slice(0, 10);
}

// 递归遍历文件夹寻找特定前缀的xlsx文件，并返回该文件名（包括完整路径）
async function findUniqueXlsxFileByPrefix(dirPath, prefix) {
    let todayExcel = ''; // 初始化为空字符串

    try {
        // 异步读取目录内容
        const files = await fs.promises.readdir(dirPath, { withFileTypes: true });

        for (let file of files) {
            const fullPath = path.join(dirPath, file.name);

            if (file.isDirectory()) {
                // 如果是目录，则递归查找
                todayExcel = await findUniqueXlsxFileByPrefix(fullPath, prefix);
                if (todayExcel) break; // 找到后立即退出循环
            } else if (path.extname(file.name).toLowerCase() === '.xlsx' && file.name.startsWith(prefix)) {
                // 如果是文件且符合要求，则记录下来并退出循环
                todayExcel = fullPath;
                break;
            }
        }

        // 如果没有找到符合条件的文件，抛出错误
        if (!todayExcel) {
            throw new Error('No matching XLSX file found.');
        }
    } catch (err) {
        console.error(err.message);
        throw err; // 抛出异常以便可以在调用处被捕获
    }

    return todayExcel; // 返回找到的文件名或空字符串
}

// 使用函数，提供文件夹路径和今天的日期字符串作为前缀
const directoryPath = './2025'; // 替换为你的目标文件夹路径

// 定义文件路径
const Configurationspath = './Configurations.xlsx';

// 读取 Excel 文件
function readExcel(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
}

// 主程序逻辑
async function main() {
    try {
        // 查找并打印今天的Excel文件名
        const TodayExcel = await findUniqueXlsxFileByPrefix(directoryPath, getTodayString());
        console.log(`Today's Excel file: ${TodayExcel}`); // 输出找到的文件名
        
        // 读取配置文件数据
        const ConfigurationsData = await readExcel(Configurationspath);

        // 获取阈值，假设它只存在于第一个对象中
        let thresholdValue = 0;
        if (ConfigurationsData.length > 0 && ConfigurationsData[0].阈值) {
            const thresholdValueStr = ConfigurationsData[0].阈值.replace('M', '');
            thresholdValue = parseFloat(thresholdValueStr);
            
            // 检查转换是否成功
            if (isNaN(thresholdValue)) {
                throw new Error('Invalid threshold value format.');
            }
        }

        // 创建新的数组对象
        let updatedData = [];

        // 遍历ConfigurationsData数组对象里的每个"分类"的value
        ConfigurationsData.forEach(item => {
            if (item.分类 && item['基准大小（M）']) {
                // 将“基准大小（M）”转换为数值并加上阈值
                const baseSizeStr = item['基准大小（M）'].replace('M', '');
                const baseSize = parseFloat(baseSizeStr);
                
                // 检查转换是否成功
                if (isNaN(baseSize)) {
                    throw new Error('Invalid base size format.');
                }

                // 更新后的值
                const updatedValue = baseSize + thresholdValue;

                // 添加到新的数组对象中
                updatedData.push({
                    [item.分类]: updatedValue
                });
            }
        });

        console.log(updatedData); // 输出更新后的数据
    } catch (err) {
        console.error('Error occurred:', err);
    }
}

main(); // 调用主函数来执行程序逻辑