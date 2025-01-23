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
        const TodayExcel = await findUniqueXlsxFileByPrefix(directoryPath, getTodayString());
        console.log(`Today's Excel file: ${TodayExcel}`); // 输出找到的文件名
        
        // 继续使用 TodayExcel 变量进行后续操作
        if (TodayExcel) {
            const data = readExcel(TodayExcel);
            // 输出从今天Excel文件读取的数据
            // console.log(data);
            
            // 读取配置文件
            const ConfigurationsData = readExcel(Configurationspath);
            // 输出配置文件数据
            // console.log(ConfigurationsData); 
        }
    } catch (err) {
        console.error('Error occurred:', err);
    }
}

main(); // 调用主函数来执行程序逻辑