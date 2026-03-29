const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  let data = {};

  try {
    data = await res.json();
  } catch (error) {
    data = { message: res.statusText || "Bad Response" };
  }

  if (res.ok) {
    return data;
  }

  throw { name: "servicesError", message: data };
}

export default class ExternalServices {
  constructor() {}

  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async searchProducts(query) {
    const categories = ["tents", "backpacks", "sleeping-bags", "hammocks"];
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    const resultsByCategory = await Promise.all(
      categories.map(async (category) => {
        const response = await fetch(`${baseURL}products/search/${category}`);
        const data = await convertToJson(response);
        return data.Result || [];
      })
    );

    const allProducts = resultsByCategory.flat();

    return allProducts.filter((product) => {
      const searchableText = [
        product.Name,
        product.NameWithoutBrand,
        product.Brand?.Name,
        product.Category,
        product.DescriptionHtmlSimple,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(payload) {
    const url = `${baseURL}checkout`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    const response = await fetch(url, options);
    return convertToJson(response);
  }

  async registerUser(payload) {
    const url = `${baseURL}users`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    const response = await fetch(url, options);
    return convertToJson(response);
  }
}
