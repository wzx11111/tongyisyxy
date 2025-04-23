import express from 'express'; // 导入 Express 框架，用于构建 Web 服务器
import cors from 'cors'; // 导入 CORS 中间件，用于处理跨域请求
import OpenAI from 'openai'; // 导入 OpenAI 官方库，用于与 OpenAI API 交互
import { fileURLToPath } from 'url'; // 导入 url 模块的 fileURLToPath 函数，用于将文件 URL 转换为路径
import { dirname, join } from 'path'; // 导入 path 模块的 dirname 和 join 函数，用于处理文件和目录路径

console.log("==========服务器初始化开始===========");

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

console.log(`当前路径：${_dirname}`);

const app = express();

const port = process.env.PORT || 3000;

console.log(`当前端口：${port}`);

app.use(cors());
app.use(express.json());
app.use(express.static(join(_dirname, 'public')));

console.log("中间层配置成功");

const openai = new OpenAI({
apiKey: "sk-86e4675f4fbb4668b87aaeee558d8678",
baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
});

console.log("OpenAI实例配置成功");

app.post('/api/chat', async (req, res) => {
    console.log("=================收到聊天请求===================");
    console.log(`请求时间：${new Date().toLocaleString()}`);

    try {
        const { messages } = req.body;
        console.log('接受到消息：',messages);
        const response = await openai.chat.completions.create({
            model: "qwen-plus",
            messages:[
                {role: "system", content: "You are a helpful assistant."},
                ...messages

            ]
        });

        console.log("AI接口调用成功");

        const aiResponse = response.choices[0].message.content;
        const aiRole = response.choices[0].message.role;

        console.log(`AI回复内容：${aiRole};${aiResponse.substring(0, 50)}...`);
        res.json({
            messages:aiResponse,
            role:aiRole
        });
        console.log("AI回复已发送给用户浏览器");
    }catch (error) {
        console.error('AI接口调用失败：', error);
    }
});
app.listen(port, () => {
    console.log(`服务器已启动，监听端口 ${port}`);
    console.log(`地址：http://localhost:${port}`);
});