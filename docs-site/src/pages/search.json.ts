import { withBase } from '../lib/urls';
import { getCollection } from 'astro:content';
export async function GET() {
  const docs = await getCollection('docs');
  const v2 = await getCollection('v2');
  const index = [...docs.map(doc=>({title:doc.data.title,description:doc.data.description,group:doc.data.group,body:doc.body,url:withBase(`/docs/${doc.id}/`) })),
    ...v2.map(doc=>({title:doc.data.title,description:doc.data.description,group:doc.data.group,body:doc.body,url:withBase('/v2/')}))];
  return new Response(JSON.stringify(index), {headers:{'Content-Type':'application/json; charset=utf-8'}});
}
