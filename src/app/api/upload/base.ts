import { llm } from "./llm";

export async function autoFillFields(tableFields: string, text: string) {
  const res = await llm.chat.completions.create({
    model: 'moonshot-v1-8k',
    temperature: 0.1,
    messages: [
      { role: 'system', content: `当前时间的时间戳为:${Date.now()}\n请根据用户提供的简历信息填写对应字段数据(type:5填写时间戳number)，并以纯文本的json数据返回(非markdown)，返回数据格式为：{fields: { [field.id]: value }}\n\n## schema\n ${tableFields}` },
      { role: 'user', content: text }
    ],
    response_format: { type: 'json_object' }
  })
  const data = JSON.parse(res.choices[0].message.content!)
  return data;
}