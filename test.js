
const context1 = "\nBacklog6126\nHow: 活动—精选活动—WCS分地区显示大会页签&活动标题\nWhere: 主界面_活动\nWhat: 2025年WCS分地区赛事的页签&活动标题（Korea WCS Qualifier）\n"
const context2 = "\nMcat6224\nHow: 1.打开对战指南-黎莫特竞技场（500分）\n2.选择页签2-1\n3.点击文柚果图标\n4.查看弹出的窗口中的文字描述\nWhere: 对战指南\nWhat: 对战指南描述文本\n"



// 提取 How: 之后的部分
const howMatch1 = context1.match(/How:\s*(.*?)\s*Where:/);
const howMatch2= context2.match(/How:\s*(.*?)\s*Where:/);
const aa = howMatch1 ? howMatch1[1] : ''; 
const bb = howMatch2 ? howMatch2[1] : ''; 

console.log(aa,'aa')
console.log(bb,'bb')