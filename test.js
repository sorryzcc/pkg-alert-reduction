const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 定义文件路径
const Configurationspath = './Configurations.xlsx';

// 读取 Excel 文件并记录文件名
function readExcel(filePath, fileName) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet).map(item => ({ ...item, "来源": fileName }));
}

// 读取七个 Excel 文件并记录文件名
const ConfigurationsData = readExcel(Configurationspath, "Configurationspath");



console.log(ConfigurationsData);
