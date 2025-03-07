import { type NextRequest, NextResponse } from 'next/server';
import { getHttpClient } from '@/services/http';

export async function GET(request: NextRequest, 
  { params }: { params: Promise<{ slug: string }> }
) {
  const storeId = request.nextUrl.searchParams.get('storeId'); // Get query params
  const slug = (await params).slug // Récupère le paramètre de route "slug"

  try {
    const response = await getHttpClient().get(`/api/user/${slug}`, {
      params: storeId ? {storeId: storeId } : undefined, // Conditional params
    });

    if (response.data) {
      return new NextResponse(JSON.stringify(response.data), { status: 200 });
    } else {
      return new NextResponse(JSON.stringify({ message: 'Campaigns not found' }), { status: 404 });
    }
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: 'Error fetching campaigns' }), { status: 500 }); // Handle errors
  }
}