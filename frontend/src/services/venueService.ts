import type { Venue } from "../types";

const API_URL = "http://localhost:8080/api/venues";

const galleryPool = [
  "https://cache.marriott.com/content/dam/marriott-renditions/LIMWI/limwi-ballroom-dance-floor-9195-hor-clsc.jpg?output-quality=70&interpolation=progressive-bilinear&downsize=1200px:*",
  "https://provocateurroses.com/wp-content/uploads/2023/06/decoracion-floral-scaled-e1685735037886-1024x653.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY9rRSpOixRBamk8H_6NegSOXCuArbit4xgUZxITeCS71aTm-1fBKwRDI&s=10",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS13r9p2BYF9JnW85NIX3FRkAbfd6fJyGjjZetPxW4t5Wy9Pv1HS5l8OyEN&s=10",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnZKol6i6LGUxgyR0D5xkaUbeP7jOMxAxd-qtoKDpr7dMDPc7Zr1zRJ2OL&s=10",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBJizmFmbA7arp4pIpK6srfA8zgvLwmdrxZ9orqo4Zw-vX6yyX_o8WbKQ&s=10",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_gPqaHgLM1CEfBOh57xi32ZtewbA6fOJxmOBCjSLkGzdk7lI-I2HKAh-a&s=10"
];

export const venueService = {
  async getVenues(category?: string): Promise<Venue[]> {
    const url = category && category !== "Todos" 
      ? `${API_URL}?category=${encodeURIComponent(category)}`
      : API_URL;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error al obtener los locales");
    }

    const data = await response.json();

    return data.map((item: any, idx: number) => {
      const mainImg = item.imageUrl || galleryPool[idx % galleryPool.length];
      return {
        id: item.id.toString(),
        name: item.name,
        description: item.description || "",
        address: item.address || "",
        district: item.district || "Arequipa",
        capacity: item.maxCapacity || 0,
        price: item.referencePrice || 0,
        rating: item.rating || 4.5,
        reviewCount: item.reviewCount || 0,
        category: item.category || "Social",
        amenities: item.amenities ? item.amenities.split(",") : [],
        image: mainImg,
        images: [
          mainImg,
          galleryPool[(idx + 1) % galleryPool.length],
          galleryPool[(idx + 2) % galleryPool.length],
          galleryPool[(idx + 3) % galleryPool.length]
        ]
      };
    });
  },

  async getVenueById(id: string): Promise<Venue> {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("No se pudo encontrar el local");
    }

    const item = await response.json();
    const idNum = parseInt(id, 10) || 0;
    const mainImg = item.imageUrl || galleryPool[idNum % galleryPool.length];

    return {
      id: item.id.toString(),
      name: item.name,
      description: item.description || "",
      address: item.address || "",
      district: item.district || "Arequipa",
      capacity: item.maxCapacity || 0,
      price: item.referencePrice || 0,
      rating: item.rating || 4.5,
      reviewCount: item.reviewCount || 0,
      category: item.category || "Social",
      amenities: item.amenities ? item.amenities.split(",") : [],
      image: mainImg,
      images: [
        mainImg,
        galleryPool[(idNum + 1) % galleryPool.length],
        galleryPool[(idNum + 2) % galleryPool.length],
        galleryPool[(idNum + 3) % galleryPool.length]
      ]
    };
  }
};
