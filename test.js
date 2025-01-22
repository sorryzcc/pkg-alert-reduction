
const context = "\nBacklog6126\nHow: 活动—精选活动—WCS分地区显示大会页签&活动标题\nWhere: 主界面_活动\nWhat: 2025年WCS分地区赛事的页签&活动标题（Korea WCS Qualifier）\n"

let state = {}
// 提取场景信息
const textSceneInformation1Match = context.match(/^\s*(Backlog|Mcat|JIRA)/);
state.textSceneInformation1 = textSceneInformation1Match ? textSceneInformation1Match[1] : '';

const textSceneInformation2Match = context.match(/(Backlog|Mcat|JIRA)(\d+)(?=\s*How:)/);
state.textSceneInformation2 = textSceneInformation2Match ? textSceneInformation2Match[2] : '';

console.log(state.textSceneInformation1)
