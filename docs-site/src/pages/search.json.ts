import { withBase } from '../lib/urls';
import { getCollection } from 'astro:content';
export async function GET() {
  const docs = await getCollection('docs');
  return new Response(JSON.stringify(docs.map(doc=>({title:doc.data.title,description:doc.data.description,group:doc.data.group,body:doc.body,url:withBase(`/docs/${doc.id}/`) }))), {headers:{'Content-Type':'application/json; charset=utf-8'}});
}
