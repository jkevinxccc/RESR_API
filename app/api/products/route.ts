import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// ==========================================
// CORS
// ==========================================

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// ==========================================
// OPTIONS: CORS Preflight
// ==========================================

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// ==========================================
// 1. GET: Ambil Semua Produk
// ==========================================

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*');

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Gagal mengambil data dari Supabase',
          error_message: error.message,
          error_code: error.code,
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        count: data ? data.length : 0,
        data: data || [],
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Server Crash / Unknown Error',
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

// ==========================================
// 2. POST: Tambah Produk Baru
// ==========================================

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      !body.title ||
      typeof body.price !== 'number'
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Field "title" (string) dan "price" (number) wajib diisi!',
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([
        {
          title: body.title,
          price: body.price,
          stock: body.stock ?? 0,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Gagal menambah data ke Supabase',
          error_message: error.message,
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Produk berhasil dibuat!',
        data: data[0],
      },
      {
        status: 201,
        headers: corsHeaders,
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Invalid JSON request body',
      },
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }
}