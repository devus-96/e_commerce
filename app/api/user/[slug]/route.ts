import { type NextRequest, NextResponse } from 'next/server';
import { getHttpClient } from '@/services/http';

export async function GET(request: NextRequest, 
  { params }: { params: Promise<{ slug: string }> }
) {
  const _id = request.nextUrl.searchParams.get('_id'); // Get query params
  const storeId = request.nextUrl.searchParams.get('_id'); // Get query params
  const slug = (await params).slug // Récupère le paramètre de route "slug"

  try {
    const response = await getHttpClient().get(`/${slug}`, { // path forward server
      params: _id ? {_id: _id } : 
              storeId ? {storeId: storeId} : 
              storeId && _id ?  {_id: _id, storeId: storeId} : 
              undefined, // Conditional params
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

export async function POST(request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // 1. Récupérer les données envoyées par le client
    const data = await request.json(); // Utilisez request.json() pour parser le corps de la requête
    const { slug } = params; // Récupère le paramètre de route "slug"

    // 2. Traiter les données (validation, stockage en base de données, etc.)
    // Exemple : Envoyer les données à une API externe
    const response = await getHttpClient().post(`/api/user/${slug}`, data);

    // 3. Envoyer une réponse au client
    return new NextResponse(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new NextResponse(JSON.stringify({ message: 'Error posting campaigns' }), { status: 500 });
  }
}

export async function PUT (request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const data = await request.json(); // Utilisez request.json() pour parser le corps de la requête
  const _id = request.nextUrl.searchParams.get('_id'); // Get query params
  const { slug } = params; // Récupère le paramètre de route "slug"

  try {
     // 2. Traiter les données (validation, stockage en base de données, etc.)
    // Exemple : Envoyer les données à une API externe
    const response = await getHttpClient().post(`/api/user/${slug}`, data, {
      params: _id ? { _id: _id } : undefined, // Conditional params
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