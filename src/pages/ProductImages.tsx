import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductImage {
  id: number;
  id_produit: number;
  color: string;
  image_url: string;
  produit?: {
    nom: string;
  };
}

const ProductImages = () => {
  const [products, setProducts] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('images_produit')
        .select(`
          id,
          id_produit,
          color,
          image_url,
          produit:id_produit (
            nom
          )
        `)
        .order('id_produit', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-foreground">Product Images Gallery</h1>
        {products.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Aucune image de produit disponible</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {products.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={image.image_url}
                      alt={`${image.produit?.nom} - ${image.color}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">ID: {image.id_produit}</p>
                      <p className="font-medium text-foreground">{image.produit?.nom}</p>
                      <p className="text-sm text-muted-foreground">Color: {image.color}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Product Images Gallery</h1>
      {products.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <p className="text-muted-foreground text-center">Aucune image de produit disponible</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Product ID</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead className="w-[200px]">Image</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((image) => (
                  <TableRow key={image.id}>
                    <TableCell className="font-medium">{image.id_produit}</TableCell>
                    <TableCell>{image.produit?.nom}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary text-secondary-foreground">
                        {image.color}
                      </span>
                    </TableCell>
                    <TableCell>
                      <img
                        src={image.image_url}
                        alt={`${image.produit?.nom} - ${image.color}`}
                        className="w-24 h-24 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductImages;
