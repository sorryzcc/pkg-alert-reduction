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

// 读取 Excel 文件
function readExcel(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // 读取数据并转换为 JSON 格式
    const data = XLSX.utils.sheet_to_json(worksheet);

    // 安全地读取阈值，如果不存在则使用默认值 0
    const thresholdCell = worksheet['D2'];
    const threshold = thresholdCell && typeof thresholdCell.v !== 'undefined' ? parseFloat(thresholdCell.v) : 0;

    return {
        data,
        threshold
    };
}

// 处理 TodayExcelData 和 ConfigurationsData，生成新的结果对象数组
function processAndCompare(todayData, configData, threshold) {
    const resultArray = [];

    // 创建一个映射来快速查找配置文件中的数据
    const configMap = new Map();
    configData.forEach(item => {
        configMap.set(item.分类, item);
    });

    // 遍历今天的Excel数据
    todayData.forEach(todayItem => {
        const basePackageName = todayItem['基准包名:'];
        const currentSizeStr = todayItem['当前包名:'].replace('M', '');
        const currentSize = parseFloat(currentSizeStr);

        // 查找配置文件中对应的项
        const configItem = configMap.get(basePackageName);
        if (configItem) {
            // 获取配置文件中的基准大小
            const baseSizeStr = configItem['基准大小（M）'].replace('M', '');
            const baseSize = parseFloat(baseSizeStr);

            // 计算是否超过（基准大小 + 阈值）
            const exceededThreshold = currentSize > (baseSize + threshold);

            // 如果今天的当前大小大于（基准大小 + 阈值）
            if (exceededThreshold) {
                // 计算超出大小
                const exceededSize = currentSize - baseSize;

                // 创建新的对象并添加到结果数组中
                resultArray.push({
                    分类: basePackageName,
                    责任人: configItem.责任人,
                    超出大小: `${exceededSize.toFixed(3)}M` // 保留三位小数
                });
            }
        }
    });

    return resultArray;
}

// 主程序逻辑
async function main() {
    try {
        // 查找今天的Excel文件
        const TodayExcel = await findUniqueXlsxFileByPrefix(directoryPath, getTodayString());

        // 读取今天的Excel文件
        const { data: TodayExcelData } = await readExcel(TodayExcel);

        // 读取配置文件数据和阈值
        const Configurationspath = './Configurations.xlsx';
        const { data: ConfigurationsData, threshold } = await readExcel(Configurationspath);

        // 处理并比较两个数据集，生成新的结果对象数组
        const comparisonResult = processAndCompare(TodayExcelData, ConfigurationsData, threshold);

        // 输出最终的比较结果
        console.log('Comparison Result:', comparisonResult);
        
        // 可选：将结果写入新的Excel文件或其他形式的输出
        // 这里可以加入您希望的结果保存逻辑
    } catch (err) {
        console.error('Error occurred:', err);
    }
}

// 使用函数，提供文件夹路径和今天的日期字符串作为前缀
const directoryPath = './2025'; // 替换为你的目标文件夹路径

main(); // 调用主函数来执行程序逻辑