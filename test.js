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

const ConfigurationsData = readExcel(Configurationspath, "Configurationspath");

console.log(ConfigurationsData,'ConfigurationsData');

// 直接获取所有责任人的列表，包括重复项
// const allResponsibles = ConfigurationsData.map(item => item['责任人']).filter(Boolean).join(','); 


// console.log(allResponsibles)

// const allResponsibles = []; 
// setEnv('allResponsibles', `${allResponsibles}`);