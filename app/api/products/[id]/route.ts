import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// ==========================================
// OPTIONS
// ==========================================

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// ==========================================
// DELETE: Hapus Produk
// ==========================================

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const { data, error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Gagal menghapus produk',
          error_message: error.message,
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Produk tidak ditemukan',
        },
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Produk berhasil dihapus!',
        data: data[0],
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
        error: err?.message || 'Server Error',
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}