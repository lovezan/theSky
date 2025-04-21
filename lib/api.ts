import axios from "axios"

// Define the Country type based on the API response
export interface Country {
  name: string
  topLevelDomain: string[]
  alpha2Code: string
  alpha3Code: string
  callingCodes: string[]
  capital: string
  altSpellings: string[]
  subregion: string
  region: string
  population: number
  latlng: number[]
  demonym: string
  area: number
  timezones: string[]
  borders: string[]
  nativeName: string
  numericCode: string
  flags: {
    svg: string
    png: string
  }
  currencies: {
    code: string
    name: string
    symbol: string
  }[]
  languages: {
    iso639_1: string
    iso639_2: string
    name: string
    nativeName: string
  }[]
  translations: {
    [key: string]: string
  }
  flag: string
  regionalBlocs: {
    acronym: string
    name: string
  }[]
  cioc: string
  independent: boolean
}

// Replace the entire fetchCountries function with this updated version
export async function fetchCountries(): Promise<Country[]> {
  try {
    const response = await axios.get("https://restcountries.com/v3.1/all")

    // Transform the response to match our Country interface
    return response.data.map((country) => ({
      name: country.name.common,
      topLevelDomain: country.tld || [],
      alpha2Code: country.cca2,
      alpha3Code: country.cca3,
      callingCodes: country.idd?.suffixes?.map((suffix) => `${country.idd.root}${suffix}`) || [],
      capital: country.capital?.[0] || "N/A",
      altSpellings: country.altSpellings || [],
      subregion: country.subregion || "N/A",
      region: country.region || "N/A",
      population: country.population || 0,
      latlng: country.latlng || [0, 0],
      demonym: country.demonyms?.eng?.m || "",
      area: country.area || 0,
      timezones: country.timezones || [],
      borders: country.borders || [],
      nativeName: country.name.nativeName
        ? Object.values(country.name.nativeName)[0]?.common || country.name.common
        : country.name.common,
      numericCode: country.ccn3 || "",
      flags: {
        svg: country.flags?.svg || "",
        png: country.flags?.png || "",
      },
      currencies: country.currencies
        ? Object.entries(country.currencies).map(([code, details]) => ({
            code,
            name: details.name,
            symbol: details.symbol,
          }))
        : [],
      languages: country.languages
        ? Object.entries(country.languages).map(([code, name]) => ({
            iso639_1: code.substring(0, 2),
            iso639_2: code,
            name: name,
            nativeName: name,
          }))
        : [],
      translations: country.translations
        ? Object.entries(country.translations).reduce((acc, [key, value]) => {
            acc[key] = value.common
            return acc
          }, {})
        : {},
      flag: country.flags?.png || "",
      regionalBlocs: country.regionalBlocs || [],
      cioc: country.cioc || "",
      independent: country.independent || false,
    }))
  } catch (error) {
    console.error("Error fetching the country data:", error)
    // Return a fallback dataset in case of API failure
    return getFallbackCountries()
  }
}

// Replace the fetchCountryByCode function with this updated version
export async function fetchCountryByCode(code: string): Promise<Country | null> {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/alpha/${code}`)

    if (response.data && response.data.length > 0) {
      const country = response.data[0]
      return {
        name: country.name.common,
        topLevelDomain: country.tld || [],
        alpha2Code: country.cca2,
        alpha3Code: country.cca3,
        callingCodes: country.idd?.suffixes?.map((suffix) => `${country.idd.root}${suffix}`) || [],
        capital: country.capital?.[0] || "N/A",
        altSpellings: country.altSpellings || [],
        subregion: country.subregion || "N/A",
        region: country.region || "N/A",
        population: country.population || 0,
        latlng: country.latlng || [0, 0],
        demonym: country.demonyms?.eng?.m || "",
        area: country.area || 0,
        timezones: country.timezones || [],
        borders: country.borders || [],
        nativeName: country.name.nativeName
          ? Object.values(country.name.nativeName)[0]?.common || country.name.common
          : country.name.common,
        numericCode: country.ccn3 || "",
        flags: {
          svg: country.flags?.svg || "",
          png: country.flags?.png || "",
        },
        currencies: country.currencies
          ? Object.entries(country.currencies).map(([code, details]) => ({
              code,
              name: details.name,
              symbol: details.symbol,
            }))
          : [],
        languages: country.languages
          ? Object.entries(country.languages).map(([code, name]) => ({
              iso639_1: code.substring(0, 2),
              iso639_2: code,
              name: name,
              nativeName: name,
            }))
          : [],
        translations: country.translations
          ? Object.entries(country.translations).reduce((acc, [key, value]) => {
              acc[key] = value.common
              return acc
            }, {})
          : {},
        flag: country.flags?.png || "",
        regionalBlocs: country.regionalBlocs || [],
        cioc: country.cioc || "",
        independent: country.independent || false,
      }
    }
    return null
  } catch (error) {
    console.error(`Error fetching country with code ${code}:`, error)
    // Try to find the country in the fallback data
    const fallbackCountries = getFallbackCountries()
    return fallbackCountries.find((c) => c.alpha3Code === code) || null
  }
}

// Add this new function to provide fallback data if the API fails
function getFallbackCountries(): Country[] {
  // Return a small set of sample countries as fallback
  return [
    {
      name: "United States",
      topLevelDomain: [".us"],
      alpha2Code: "US",
      alpha3Code: "USA",
      callingCodes: ["1"],
      capital: "Washington, D.C.",
      altSpellings: ["US", "USA", "United States of America"],
      subregion: "Northern America",
      region: "Americas",
      population: 331002651,
      latlng: [38, -97],
      demonym: "American",
      area: 9629091,
      timezones: [
        "UTC-12:00",
        "UTC-11:00",
        "UTC-10:00",
        "UTC-09:00",
        "UTC-08:00",
        "UTC-07:00",
        "UTC-06:00",
        "UTC-05:00",
        "UTC-04:00",
        "UTC+10:00",
        "UTC+12:00",
      ],
      borders: ["CAN", "MEX"],
      nativeName: "United States",
      numericCode: "840",
      flags: {
        svg: "https://flagcdn.com/us.svg",
        png: "https://flagcdn.com/w320/us.png",
      },
      currencies: [
        {
          code: "USD",
          name: "United States dollar",
          symbol: "$",
        },
      ],
      languages: [
        {
          iso639_1: "en",
          iso639_2: "eng",
          name: "English",
          nativeName: "English",
        },
      ],
      translations: {
        br: "Estados Unidos",
        pt: "Estados Unidos",
        nl: "Verenigde Staten",
        hr: "Sjedinjene Američke Države",
        fa: "ایالات متحده آمریکا",
        de: "Vereinigte Staaten von Amerika",
        es: "Estados Unidos",
        fr: "États-Unis",
        ja: "アメリカ合衆国",
        it: "Stati Uniti D'America",
        hu: "Amerikai Egyesült Államok",
      },
      flag: "https://flagcdn.com/w320/us.png",
      regionalBlocs: [
        {
          acronym: "NAFTA",
          name: "North American Free Trade Agreement",
        },
      ],
      cioc: "USA",
      independent: true,
    },
    {
      name: "France",
      topLevelDomain: [".fr"],
      alpha2Code: "FR",
      alpha3Code: "FRA",
      callingCodes: ["33"],
      capital: "Paris",
      altSpellings: ["FR", "French Republic", "République française"],
      subregion: "Western Europe",
      region: "Europe",
      population: 67391582,
      latlng: [46, 2],
      demonym: "French",
      area: 551695,
      timezones: [
        "UTC-10:00",
        "UTC-09:30",
        "UTC-09:00",
        "UTC-08:00",
        "UTC-04:00",
        "UTC-03:00",
        "UTC+01:00",
        "UTC+02:00",
        "UTC+03:00",
        "UTC+04:00",
        "UTC+05:00",
        "UTC+10:00",
        "UTC+11:00",
        "UTC+12:00",
      ],
      borders: ["AND", "BEL", "DEU", "ITA", "LUX", "MCO", "ESP", "CHE"],
      nativeName: "France",
      numericCode: "250",
      flags: {
        svg: "https://flagcdn.com/fr.svg",
        png: "https://flagcdn.com/w320/fr.png",
      },
      currencies: [
        {
          code: "EUR",
          name: "Euro",
          symbol: "€",
        },
      ],
      languages: [
        {
          iso639_1: "fr",
          iso639_2: "fra",
          name: "French",
          nativeName: "français",
        },
      ],
      translations: {
        br: "França",
        pt: "França",
        nl: "Frankrijk",
        hr: "Francuska",
        fa: "فرانسه",
        de: "Frankreich",
        es: "Francia",
        fr: "France",
        ja: "フランス",
        it: "Francia",
        hu: "Franciaország",
      },
      flag: "https://flagcdn.com/w320/fr.png",
      regionalBlocs: [
        {
          acronym: "EU",
          name: "European Union",
        },
      ],
      cioc: "FRA",
      independent: true,
    },
    {
      name: "Japan",
      topLevelDomain: [".jp"],
      alpha2Code: "JP",
      alpha3Code: "JPN",
      callingCodes: ["81"],
      capital: "Tokyo",
      altSpellings: ["JP", "Nippon", "Nihon"],
      subregion: "Eastern Asia",
      region: "Asia",
      population: 125836021,
      latlng: [36, 138],
      demonym: "Japanese",
      area: 377930,
      timezones: ["UTC+09:00"],
      borders: [],
      nativeName: "日本",
      numericCode: "392",
      flags: {
        svg: "https://flagcdn.com/jp.svg",
        png: "https://flagcdn.com/w320/jp.png",
      },
      currencies: [
        {
          code: "JPY",
          name: "Japanese yen",
          symbol: "¥",
        },
      ],
      languages: [
        {
          iso639_1: "ja",
          iso639_2: "jpn",
          name: "Japanese",
          nativeName: "日本語",
        },
      ],
      translations: {
        br: "Japão",
        pt: "Japão",
        nl: "Japan",
        hr: "Japan",
        fa: "ژاپن",
        de: "Japan",
        es: "Japón",
        fr: "Japon",
        ja: "日本",
        it: "Giappone",
        hu: "Japán",
      },
      flag: "https://flagcdn.com/w320/jp.png",
      regionalBlocs: [],
      cioc: "JPN",
      independent: true,
    },
  ]
}

// Function to generate blog content from country data
export function generateBlogContent(country: Country): string {
  return `
    <p class="text-lg mb-6">Welcome to our comprehensive guide to ${country.name}, a fascinating country located in ${country.region}. Known for its rich culture, stunning landscapes, and unique history, ${country.name} offers travelers an unforgettable experience.</p>
    
    <h2 class="text-2xl font-bold text-white mb-4">About ${country.name}</h2>
    
    <p class="mb-4">${country.name}, officially known as ${country.name} (${country.nativeName} in the local language), is located in ${country.subregion}. The capital city is ${country.capital}, which serves as the cultural and economic hub of the country.</p>
    
    <p class="mb-6">With a population of approximately ${country.population.toLocaleString()} people, ${country.name} is home to diverse communities and cultures that have shaped its unique identity throughout history.</p>
    
    <blockquote class="border-l-4 border-purple-500 pl-4 italic text-gray-300 my-6">
      "Traveling to ${country.name} is like stepping into a living museum where ancient traditions blend seamlessly with modern life, creating an experience that captivates all your senses."
    </blockquote>
    
    <h2 class="text-2xl font-bold text-white mb-4">Language and Culture</h2>
    
    <p class="mb-4">${country.name} is linguistically diverse, with ${country.languages.length > 1 ? "several languages spoken" : "one primary language spoken"} throughout the country. ${country.languages.map((lang) => lang.name).join(", ")} ${country.languages.length > 1 ? "are" : "is"} the ${country.languages.length > 1 ? "official languages" : "official language"}, reflecting the country's rich cultural heritage.</p>
    
    <p class="mb-6">The culture of ${country.name} has been shaped by its history, geography, and the various influences it has absorbed over centuries. From traditional music and dance to local cuisine and crafts, there's so much to explore and appreciate.</p>
    
    <div class="bg-gray-800/50 rounded-xl p-6 my-8">
      <h3 class="text-xl font-bold text-white mb-3">Quick Facts About ${country.name}</h3>
      <ul class="list-disc list-inside space-y-2 text-gray-300">
        <li><span class="font-medium text-purple-400">Region:</span> ${country.region}</li>
        <li><span class="font-medium text-purple-400">Subregion:</span> ${country.subregion}</li>
        <li><span class="font-medium text-purple-400">Capital:</span> ${country.capital}</li>
        <li><span class="font-medium text-purple-400">Population:</span> ${country.population.toLocaleString()}</li>
        <li><span class="font-medium text-purple-400">Area:</span> ${country.area?.toLocaleString() || "N/A"} km²</li>
        <li><span class="font-medium text-purple-400">Currency:</span> ${country.currencies?.map((c) => `${c.name} (${c.symbol})`).join(", ") || "N/A"}</li>
        <li><span class="font-medium text-purple-400">Languages:</span> ${country.languages.map((l) => l.name).join(", ")}</li>
        <li><span class="font-medium text-purple-400">Calling Code:</span> +${country.callingCodes[0]}</li>
      </ul>
    </div>
    
    <h2 class="text-2xl font-bold text-white mb-4">Geography and Climate</h2>
    
    <p class="mb-4">${country.name} is geographically situated at coordinates [${country.latlng.join(", ")}], covering an area of ${country.area?.toLocaleString() || "N/A"} square kilometers. The country ${country.borders.length > 0 ? `shares borders with ${country.borders.length} neighboring countries: ${country.borders.join(", ")}` : "is an island nation with no land borders"}.</p>
    
    <p class="mb-6">The climate varies across different regions of the country, influenced by factors such as elevation, proximity to water bodies, and geographical features. Travelers should research the best time to visit based on their preferred activities and the regions they plan to explore.</p>
    
    <figure class="my-8">
      <img src="${country.flags.png}" alt="Flag of ${country.name}" class="rounded-xl w-full h-auto" />
      <figcaption class="text-sm text-gray-400 mt-2 text-center">The official flag of ${country.name}</figcaption>
    </figure>
    
    <h2 class="text-2xl font-bold text-white mb-4">Travel Tips</h2>
    
    <p class="mb-4">When planning your trip to ${country.name}, consider the following tips to make your experience more enjoyable:</p>
    
    <ul class="list-disc list-inside space-y-2 text-gray-300 mb-6">
      <li>Learn a few basic phrases in ${country.languages[0].name} to connect with locals</li>
      <li>Research the local customs and etiquette to show respect for the culture</li>
      <li>Check visa requirements well in advance of your trip</li>
      <li>Be aware of the local currency (${country.currencies?.[0]?.name || "local currency"}) and have some cash on hand</li>
      <li>Try the local cuisine for an authentic cultural experience</li>
      <li>Consider the best time to visit based on weather patterns and tourist seasons</li>
    </ul>
    
    <h2 class="text-2xl font-bold text-white mb-4">Conclusion</h2>
    
    <p class="mb-4">${country.name} offers travelers a unique blend of natural beauty, cultural richness, and unforgettable experiences. Whether you're interested in exploring historical sites, enjoying outdoor adventures, or immersing yourself in the local culture, this fascinating country has something for everyone.</p>
    
    <p>Start planning your journey to ${country.name} today and prepare to create memories that will last a lifetime!</p>
  `
}

// Function to generate blog excerpt from country data
export function generateBlogExcerpt(country: Country): string {
  return `Discover the wonders of ${country.name}, a beautiful ${country.subregion} country known for its ${country.capital} capital, diverse culture, and unique attractions. Plan your perfect trip with our comprehensive travel guide.`
}

// Generate a category based on the country's region
export function generateCategory(country: Country): string {
  const region = country.region.toLowerCase()

  if (region.includes("europe")) return "europe"
  if (region.includes("asia")) return "asia"
  if (region.includes("africa")) return "africa"
  if (region.includes("america")) return "americas"
  if (region.includes("oceania")) return "oceania"

  return "destinations"
}
