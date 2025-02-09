import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get('file');

  if (!fileName) {
    return NextResponse.json({ error: 'File name is required' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'uploads', 'products', fileName);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const fileExtension = path.extname(fileName).toLowerCase();

  let contentType = 'image/jpeg';

  if (fileExtension === '.png') {
    contentType = 'image/png';
  } else if (fileExtension === '.gif') {
    contentType = 'image/gif';
  } else if (fileExtension === '.webp') {
    contentType = 'image/webp';
  }

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': contentType,
    },
  });
}
