import pandas as pd

# 读取 Excel 文件中的第一个工作表到 DataFrame
df = pd.read_excel('Configurations.xlsx')

# 显示前几行数据
print(df)