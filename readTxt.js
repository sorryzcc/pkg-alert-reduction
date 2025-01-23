const fs = require('fs');
const path = require('path');

// 定义文件路径
const filePath = './comparison_result.txt';


// 同步读取文件内容
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n').filter(line => line.trim() !== ''); // 过滤掉空行

// 解析每一行以提取责任人
const allResponsiblesSet = new Set(); // 使用Set确保责任人唯一

lines.forEach(line => {
    // 假设每一行都有“责任人:”字段，我们基于它进行分割
    const parts = line.split('责任人:');
    if (parts.length > 1) {
        const responsiblePart = parts[1].split(',')[0].trim();
        if (responsiblePart) { // 确保责任人不是空字符串
            allResponsiblesSet.add(responsiblePart);
        }
    }
});

// 将Set转换为数组然后连接成一个字符串
const allResponsibles = Array.from(allResponsiblesSet).join(',');

console.log(allResponsibles,'allResponsibles');






