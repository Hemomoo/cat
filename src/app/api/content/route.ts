import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const { type, title, content } = await request.json();
    
    // 设置内容目录路径
    const contentDir = path.join(process.cwd(), "content", type);
    
    // 确保目录存在
    await mkdir(contentDir, { recursive: true });

    // 生成文件名
    const fileName = `${title
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9-]/g, "")}-${Date.now()}.md`;

    // 构建完整的文件路径
    const filePath = path.join(contentDir, fileName);

    // 写入文件内容
    await writeFile(filePath, content, "utf-8");

    return NextResponse.json({ 
      success: true, 
      filePath: fileName 
    });
  } catch (error) {
    console.error("保存失败:", error);
    return NextResponse.json(
      { success: false, error: "文件保存失败" }, 
      { status: 500 }
    );
  }
}