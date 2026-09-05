const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding Bangladesh Classified Marketplace Data ---');

  // 1. Clear existing data
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.review.deleteMany();
  await prisma.report.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.promotionPackage.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.adAttribute.deleteMany();
  await prisma.adImage.deleteMany();
  await prisma.ad.deleteMany();
  await prisma.categoryField.deleteMany();
  await prisma.category.deleteMany();
  await prisma.location.deleteMany();
  await prisma.user.deleteMany();

  console.log('Existing records cleared.');

  // 2. Seed Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('123456', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'BazaarBondhu Master Admin',
      email: 'admin@bazaarbondhu.com',
      phone: '01711000001',
      passwordHash: adminPassword,
      role: 'ADMIN',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });

  const moderator = await prisma.user.create({
    data: {
      name: 'Ad Moderation Lead',
      email: 'moderator@bazaarbondhu.com',
      phone: '01711000002',
      passwordHash: adminPassword,
      role: 'MODERATOR',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
  });

  const businessSeller1 = await prisma.user.create({
    data: {
      name: 'Tanvir Rahman',
      email: 'navana@motorsbd.com',
      phone: '01811000003',
      passwordHash: userPassword,
      role: 'BUSINESS_SELLER',
      isVerified: true,
      businessName: 'Navana Premier Motors',
      businessLogo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=150&auto=format&fit=crop&q=80',
      businessDesc: 'Authorized importer & dealer of genuine Japanese reconditioned cars in Dhaka.',
      businessAddress: 'Plot 44, Bir Uttam Mir Shawkat Sarak, Gulshan-Tejgaon Link Rd, Dhaka',
    },
  });

  const businessSeller2 = await prisma.user.create({
    data: {
      name: 'Farhan Ahmed',
      email: 'gadgethub@bd.com',
      phone: '01911000004',
      passwordHash: userPassword,
      role: 'BUSINESS_SELLER',
      isVerified: true,
      businessName: 'Gadget Hub BD',
      businessLogo: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&auto=format&fit=crop&q=80',
      businessDesc: '100% authentic gadgets, iPhones, laptops, and gaming accessories with official warranty.',
      businessAddress: 'Shop 402, Level 4, Jamuna Future Park, Kuril, Dhaka',
    },
  });

  const regularUser1 = await prisma.user.create({
    data: {
      name: 'Rahim Chowdhury',
      email: 'rahim.ctg@gmail.com',
      phone: '01611000005',
      passwordHash: userPassword,
      role: 'USER',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
  });

  const regularUser2 = await prisma.user.create({
    data: {
      name: 'Nusrat Jahan',
      email: 'nusrat.dhk@gmail.com',
      phone: '01511000006',
      passwordHash: userPassword,
      role: 'USER',
      isVerified: false,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
  });

  console.log('Users seeded.');

  // 3. Seed Bangladesh Locations Hierarchy
  const divisionsData = [
    {
      name: 'Dhaka',
      nameBn: 'ঢাকা',
      slug: 'dhaka',
      type: 'DIVISION',
      order: 1,
      children: [
        {
          name: 'Dhaka District',
          nameBn: 'ঢাকা জেলা',
          slug: 'dhaka-district',
          type: 'DISTRICT',
          children: [
            { name: 'Mirpur', nameBn: 'মিরপুর', slug: 'mirpur', type: 'AREA' },
            { name: 'Uttara', nameBn: 'উত্তরা', slug: 'uttara', type: 'AREA' },
            { name: 'Dhanmondi', nameBn: 'ধানমন্ডি', slug: 'dhanmondi', type: 'AREA' },
            { name: 'Gulshan', nameBn: 'গুলশান', slug: 'gulshan', type: 'AREA' },
            { name: 'Banani', nameBn: 'বনানী', slug: 'banani', type: 'AREA' },
            { name: 'Bashundhara R/A', nameBn: 'বসুন্ধরা আ/এ', slug: 'bashundhara', type: 'AREA' },
            { name: 'Mohammadpur', nameBn: 'মোহাম্মদপুর', slug: 'mohammadpur', type: 'AREA' },
            { name: 'Motijheel', nameBn: 'মতিঝিল', slug: 'motijheel', type: 'AREA' },
          ],
        },
        {
          name: 'Gazipur',
          nameBn: 'গাজীপুর',
          slug: 'gazipur',
          type: 'DISTRICT',
          children: [
            { name: 'Tongi', nameBn: 'টঙ্গী', slug: 'tongi', type: 'AREA' },
            { name: 'Gazipur Sadar', nameBn: 'গাজীপুর সদর', slug: 'gazipur-sadar', type: 'AREA' },
            { name: 'Chowrasta', nameBn: 'চৌরাস্তা', slug: 'chowrasta', type: 'AREA' },
          ],
        },
        {
          name: 'Narayanganj',
          nameBn: 'নারায়ণগঞ্জ',
          slug: 'narayanganj',
          type: 'DISTRICT',
          children: [
            { name: 'Narayanganj Sadar', nameBn: 'নারায়ণগঞ্জ সদর', slug: 'narayanganj-sadar', type: 'AREA' },
            { name: 'Chashara', nameBn: 'চাষাঢ়া', slug: 'chashara', type: 'AREA' },
          ],
        },
      ],
    },
    {
      name: 'Chattogram',
      nameBn: 'চট্টগ্রাম',
      slug: 'chattogram',
      type: 'DIVISION',
      order: 2,
      children: [
        {
          name: 'Chattogram District',
          nameBn: 'চট্টগ্রাম জেলা',
          slug: 'chattogram-district',
          type: 'DISTRICT',
          children: [
            { name: 'Agrabad', nameBn: 'আগ্রাবাদ', slug: 'agrabad', type: 'AREA' },
            { name: 'GEC Circle', nameBn: 'জিইসি মোড়', slug: 'gec-circle', type: 'AREA' },
            { name: 'Nasirabad', nameBn: 'নাসিরাবাদ', slug: 'nasirabad', type: 'AREA' },
            { name: 'Halishahar', nameBn: 'হালিশহর', slug: 'halishahar', type: 'AREA' },
          ],
        },
        {
          name: "Cox's Bazar",
          nameBn: 'কক্সবাজার',
          slug: 'coxs-bazar',
          type: 'DISTRICT',
          children: [
            { name: 'Kolatoli', nameBn: 'কলাতলী', slug: 'kolatoli', type: 'AREA' },
            { name: 'Marine Drive', nameBn: 'মেরিন ড্রাইভ', slug: 'marine-drive', type: 'AREA' },
          ],
        },
      ],
    },
    {
      name: 'Sylhet',
      nameBn: 'সিলেট',
      slug: 'sylhet',
      type: 'DIVISION',
      order: 3,
      children: [
        {
          name: 'Sylhet District',
          nameBn: 'সিলেট জেলা',
          slug: 'sylhet-district',
          type: 'DISTRICT',
          children: [
            { name: 'Zindabazar', nameBn: 'জিন্দাবাজার', slug: 'zindabazar', type: 'AREA' },
            { name: 'Amberkhana', nameBn: 'আম্বরখানা', slug: 'amberkhana', type: 'AREA' },
            { name: 'Shahjalal Uposhahar', nameBn: 'শাহজালাল উপশহর', slug: 'shahjalal-uposhahar', type: 'AREA' },
          ],
        },
      ],
    },
    {
      name: 'Rajshahi',
      nameBn: 'রাজশাহী',
      slug: 'rajshahi',
      type: 'DIVISION',
      order: 4,
      children: [
        {
          name: 'Rajshahi District',
          nameBn: 'রাজশাহী জেলা',
          slug: 'rajshahi-district',
          type: 'DISTRICT',
          children: [
            { name: 'Boalia', nameBn: 'বোয়ালিয়া', slug: 'boalia', type: 'AREA' },
            { name: 'Motihar', nameBn: 'মতিহার', slug: 'motihar', type: 'AREA' },
          ],
        },
      ],
    },
    {
      name: 'Khulna',
      nameBn: 'খুলনা',
      slug: 'khulna',
      type: 'DIVISION',
      order: 5,
      children: [
        {
          name: 'Khulna District',
          nameBn: 'খুলনা জেলা',
          slug: 'khulna-district',
          type: 'DISTRICT',
          children: [
            { name: 'Sonadanga', nameBn: 'সোনাডাঙ্গা', slug: 'sonadanga', type: 'AREA' },
            { name: 'Khalishpur', nameBn: 'খালিশপুর', slug: 'khalishpur', type: 'AREA' },
          ],
        },
      ],
    },
    {
      name: 'Barishal',
      nameBn: 'বরিশাল',
      slug: 'barishal',
      type: 'DIVISION',
      order: 6,
      children: [
        {
          name: 'Barishal District',
          nameBn: 'বরিশাল জেলা',
          slug: 'barishal-district',
          type: 'DISTRICT',
          children: [
            { name: 'Band Road', nameBn: 'বাঁধ রোড', slug: 'band-road', type: 'AREA' },
            { name: 'Natullabad', nameBn: 'নথুল্লাবাদ', slug: 'natullabad', type: 'AREA' },
          ],
        },
      ],
    },
    {
      name: 'Rangpur',
      nameBn: 'রংপুর',
      slug: 'rangpur',
      type: 'DIVISION',
      order: 7,
      children: [
        {
          name: 'Rangpur District',
          nameBn: 'রংপুর জেলা',
          slug: 'rangpur-district',
          type: 'DISTRICT',
          children: [
            { name: 'Dhap', nameBn: 'ধাপ', slug: 'dhap', type: 'AREA' },
            { name: 'Jahaz Company', nameBn: 'জাহাজ কোম্পানি মোড়', slug: 'jahaz-company', type: 'AREA' },
          ],
        },
      ],
    },
    {
      name: 'Mymensingh',
      nameBn: 'ময়মনসিংহ',
      slug: 'mymensingh',
      type: 'DIVISION',
      order: 8,
      children: [
        {
          name: 'Mymensingh District',
          nameBn: 'ময়মনসিংহ জেলা',
          slug: 'mymensingh-district',
          type: 'DISTRICT',
          children: [
            { name: 'Ganginar Par', nameBn: 'গাঙিনার পাড়', slug: 'ganginar-par', type: 'AREA' },
            { name: 'Charpara', nameBn: 'চরপাড়া', slug: 'charpara', type: 'AREA' },
          ],
        },
      ],
    },
  ];

  const locationMap = {};

  for (const div of divisionsData) {
    const createdDiv = await prisma.location.create({
      data: {
        name: div.name,
        nameBn: div.nameBn,
        slug: div.slug,
        type: div.type,
        order: div.order,
      },
    });
    locationMap[div.slug] = createdDiv;

    for (const dist of div.children) {
      const createdDist = await prisma.location.create({
        data: {
          name: dist.name,
          nameBn: dist.nameBn,
          slug: dist.slug,
          type: dist.type,
          parentId: createdDiv.id,
        },
      });
      locationMap[dist.slug] = createdDist;

      for (const area of dist.children) {
        const createdArea = await prisma.location.create({
          data: {
            name: area.name,
            nameBn: area.nameBn,
            slug: area.slug,
            type: area.type,
            parentId: createdDist.id,
          },
        });
        locationMap[area.slug] = createdArea;
      }
    }
  }

  console.log('Locations seeded.');

  // 4. Seed Categories with Subcategories & Custom Fields
  const categoriesData = [
    {
      name: 'Vehicles',
      nameBn: 'যানবাহন',
      slug: 'vehicles',
      icon: 'Car',
      order: 1,
      fields: [
        { name: 'Brand', nameBn: 'ব্র্যান্ড', fieldKey: 'brand', fieldType: 'select', isRequired: true, optionsJson: JSON.stringify(['Toyota', 'Honda', 'Nissan', 'Hyundai', 'Suzuki', 'Yamaha', 'Mitsubishi', 'BMW', 'Mercedes-Benz', 'Other']) },
        { name: 'Model', nameBn: 'মডেল', fieldKey: 'model', fieldType: 'text', isRequired: true },
        { name: 'Year of Manufacture', nameBn: 'ম্যানুফ্যাকচার সাল', fieldKey: 'year', fieldType: 'number', isRequired: true },
        { name: 'Fuel Type', nameBn: 'জ্বালানী', fieldKey: 'fuel', fieldType: 'select', isRequired: true, optionsJson: JSON.stringify(['Octane', 'Petrol', 'CNG', 'Hybrid', 'Diesel', 'Electric']) },
        { name: 'Transmission', nameBn: 'ট্রান্সমিশন', fieldKey: 'transmission', fieldType: 'select', isRequired: true, optionsJson: JSON.stringify(['Automatic', 'Manual']) },
        { name: 'Kilometers Run (km)', nameBn: 'কিলোমিটার চলেছে', fieldKey: 'mileage', fieldType: 'number', unit: 'km' },
        { name: 'Engine Capacity (CC)', nameBn: 'ইঞ্জিন সিসি', fieldKey: 'engine_cc', fieldType: 'number', unit: 'cc' },
      ],
      children: [
        { name: 'Cars', nameBn: 'গাড়ি', slug: 'cars' },
        { name: 'Motorcycles', nameBn: 'মোটরসাইকেল', slug: 'motorcycles' },
        { name: 'Auto Parts & Accessories', nameBn: 'পার্টস ও এক্সেসরিজ', slug: 'auto-parts' },
        { name: 'Commercial Vehicles', nameBn: 'কমার্শিয়াল গাড়ি', slug: 'commercial-vehicles' },
      ],
    },
    {
      name: 'Electronics',
      nameBn: 'ইলেকট্রনিক্স',
      slug: 'electronics',
      icon: 'Smartphone',
      order: 2,
      fields: [
        { name: 'Brand', nameBn: 'ব্র্যান্ড', fieldKey: 'brand', fieldType: 'select', isRequired: true, optionsJson: JSON.stringify(['Apple', 'Samsung', 'Xiaomi', 'OnePlus', 'Dell', 'HP', 'Sony', 'Asus', 'Lenovo', 'Other']) },
        { name: 'Model', nameBn: 'মডেল', fieldKey: 'model', fieldType: 'text', isRequired: true },
        { name: 'Storage Capacity', nameBn: 'স্টোরেজ', fieldKey: 'storage', fieldType: 'select', optionsJson: JSON.stringify(['64GB', '128GB', '256GB', '512GB', '1TB', '2TB']) },
        { name: 'RAM', nameBn: 'র‍্যাম', fieldKey: 'ram', fieldType: 'select', optionsJson: JSON.stringify(['4GB', '6GB', '8GB', '12GB', '16GB', '32GB', '64GB']) },
        { name: 'Warranty Remaining', nameBn: 'ওয়ারেন্টি', fieldKey: 'warranty', fieldType: 'text' },
      ],
      children: [
        { name: 'Mobile Phones', nameBn: 'মোবাইল ফোন', slug: 'mobile-phones' },
        { name: 'Laptops & Computers', nameBn: 'ল্যাপটপ ও কম্পিউটার', slug: 'laptops-computers' },
        { name: 'TVs & Home Appliances', nameBn: 'টিভি ও গৃহস্থালী সামগ্রী', slug: 'tvs-appliances' },
        { name: 'Cameras & Audio', nameBn: 'ক্যামেরা ও অডিও', slug: 'cameras-audio' },
      ],
    },
    {
      name: 'Property',
      nameBn: 'প্রপার্টি',
      slug: 'property',
      icon: 'Home',
      order: 3,
      fields: [
        { name: 'Property Type', nameBn: 'প্রপার্টির ধরন', fieldKey: 'property_type', fieldType: 'select', isRequired: true, optionsJson: JSON.stringify(['Apartment', 'Full House', 'Commercial Space', 'Land / Plot']) },
        { name: 'Bedrooms', nameBn: 'বেডরুম', fieldKey: 'bedrooms', fieldType: 'number' },
        { name: 'Bathrooms', nameBn: 'বাথরুম', fieldKey: 'bathrooms', fieldType: 'number' },
        { name: 'Size (Sq Ft)', nameBn: 'আয়তন (বর্গফুট)', fieldKey: 'size_sqft', fieldType: 'number', unit: 'sqft' },
        { name: 'Floor Level', nameBn: 'ফ্লোর', fieldKey: 'floor_level', fieldType: 'text' },
        { name: 'Furnishing', nameBn: 'ফার্নিশিং', fieldKey: 'furnishing', fieldType: 'select', optionsJson: JSON.stringify(['Unfurnished', 'Semi-Furnished', 'Fully Furnished']) },
      ],
      children: [
        { name: 'Apartments & Flats', nameBn: 'ফ্ল্যাট ও অ্যাপার্টমেন্ট', slug: 'apartments-flats' },
        { name: 'Houses & Villas', nameBn: 'বাড়ি ও ভিলা', slug: 'houses-villas' },
        { name: 'Land & Plots', nameBn: 'জমি ও প্লট', slug: 'land-plots' },
        { name: 'Commercial Properties', nameBn: 'কমার্শিয়াল প্রপার্টি', slug: 'commercial-property' },
      ],
    },
    {
      name: 'Home & Living',
      nameBn: 'ঘর ও সাজসজ্জা',
      slug: 'home-living',
      icon: 'Armchair',
      order: 4,
      fields: [
        { name: 'Item Type', nameBn: 'পণ্যের ধরন', fieldKey: 'item_type', fieldType: 'text' },
        { name: 'Material', nameBn: 'উপাদান', fieldKey: 'material', fieldType: 'text' },
      ],
      children: [
        { name: 'Furniture', nameBn: 'আসবাবপত্র', slug: 'furniture' },
        { name: 'Kitchen & Dining', nameBn: 'কিচেন ও ডাইনিং', slug: 'kitchen-dining' },
        { name: 'Home Decor', nameBn: 'হোম ডেকোরেশন', slug: 'home-decor' },
      ],
    },
    {
      name: 'Fashion & Beauty',
      nameBn: 'ফ্যাশন ও লাইফস্টাইল',
      slug: 'fashion-beauty',
      icon: 'Shirt',
      order: 5,
      children: [
        { name: "Men's Fashion", nameBn: 'পুরুষদের ফ্যাশন', slug: 'mens-fashion' },
        { name: "Women's Fashion", nameBn: 'মহিলাদের ফ্যাশন', slug: 'womens-fashion' },
        { name: 'Watches & Jewelry', nameBn: 'ঘড়ি ও জুয়েলারি', slug: 'watches-jewelry' },
      ],
    },
    {
      name: 'Jobs',
      nameBn: 'চাকরি',
      slug: 'jobs',
      icon: 'Briefcase',
      order: 6,
      children: [
        { name: 'IT & Software', nameBn: 'আইটি ও সফটওয়্যার', slug: 'it-software' },
        { name: 'Sales & Marketing', nameBn: 'সেলস ও মার্কেটিং', slug: 'sales-marketing' },
        { name: 'Delivery & Logistics', nameBn: 'ডেলিভারি ও ড্রাইভার', slug: 'delivery-logistics' },
      ],
    },
    {
      name: 'Services',
      nameBn: 'সার্ভিস',
      slug: 'services',
      icon: 'Wrench',
      order: 7,
      children: [
        { name: 'Home Appliance Repair', nameBn: 'হোম অ্যাপ্লায়েন্স সার্ভিসিং', slug: 'appliance-repair' },
        { name: 'Packers & Movers', nameBn: 'বাসা বদল সার্ভিস', slug: 'packers-movers' },
        { name: 'Tutoring & Classes', nameBn: 'গৃহশিক্ষক ও কোর্স', slug: 'tutoring' },
      ],
    },
    {
      name: 'Agriculture',
      nameBn: 'কৃষি ও পশুপালন',
      slug: 'agriculture',
      icon: 'Sprout',
      order: 8,
      children: [
        { name: 'Livestock & Poultry', nameBn: 'গরু, ছাগল ও মুরগি', slug: 'livestock-poultry' },
        { name: 'Farming Equipment', nameBn: 'কৃষি যন্ত্রপাতি', slug: 'farming-equipment' },
      ],
    },
  ];

  const categoryMap = {};

  for (const cat of categoriesData) {
    const createdCat = await prisma.category.create({
      data: {
        name: cat.name,
        nameBn: cat.nameBn,
        slug: cat.slug,
        icon: cat.icon,
        order: cat.order,
      },
    });
    categoryMap[cat.slug] = createdCat;

    if (cat.fields && cat.fields.length > 0) {
      for (const f of cat.fields) {
        await prisma.categoryField.create({
          data: {
            categoryId: createdCat.id,
            name: f.name,
            nameBn: f.nameBn,
            fieldKey: f.fieldKey,
            fieldType: f.fieldType,
            isRequired: f.isRequired || false,
            unit: f.unit || null,
            optionsJson: f.optionsJson || null,
          },
        });
      }
    }

    if (cat.children && cat.children.length > 0) {
      for (const sub of cat.children) {
        const createdSub = await prisma.category.create({
          data: {
            name: sub.name,
            nameBn: sub.nameBn,
            slug: sub.slug,
            parentId: createdCat.id,
          },
        });
        categoryMap[sub.slug] = createdSub;
      }
    }
  }

  console.log('Categories seeded.');

  // 5. Seed Promotion Packages
  const packages = [
    {
      name: 'Featured Ad',
      nameBn: 'ফিচার্ড বিজ্ঞাপন',
      slug: 'featured-ad-7d',
      type: 'FEATURED_AD',
      durationDays: 7,
      price: 500,
      description: 'Get an eye-catching gold badge and 5x more clicks across search results.',
      featuresJson: JSON.stringify([
        'Highlighted card with golden border',
        'Displayed in Featured carousels',
        '5x more buyer phone views',
        'Active for 7 full days',
      ]),
    },
    {
      name: 'Top Ad',
      nameBn: 'টপ বিজ্ঞাপন',
      slug: 'top-ad-7d',
      type: 'TOP_AD',
      durationDays: 7,
      price: 900,
      description: 'Pin your ad to the absolute top of category listings for maximum attention.',
      featuresJson: JSON.stringify([
        'Pinned to top 3 slots of category',
        'Exclusive Top Ad badge',
        'Up to 10x more reach',
        'Active for 7 days',
      ]),
    },
    {
      name: 'Urgent Badge',
      nameBn: 'জরুরি বিক্রয় ব্যাজ',
      slug: 'urgent-badge-5d',
      type: 'URGENT_BADGE',
      durationDays: 5,
      price: 300,
      description: 'Add a blazing red Urgent badge to sell quickly within days.',
      featuresJson: JSON.stringify([
        'Prominent red Urgent badge',
        'Appears in Urgent Clearance filter',
        'Best for quick cash sales',
        'Active for 5 days',
      ]),
    },
    {
      name: 'Homepage Spotlight',
      nameBn: 'হোমপেজ স্পটলাইট',
      slug: 'homepage-spotlight-7d',
      type: 'HOMEPAGE_SPOTLIGHT',
      durationDays: 7,
      price: 1500,
      description: 'Maximum exposure directly on the BazaarBondhu front page banner.',
      featuresJson: JSON.stringify([
        'Featured directly on homepage showcase',
        'Seen by over 100,000+ daily visitors',
        'Top priority buyer inquiries',
        'Active for 7 days',
      ]),
    },
    {
      name: 'Bump Up',
      nameBn: 'তাত্ক্ষণিক বাম্প আপ',
      slug: 'bump-up-instant',
      type: 'BUMP_UP',
      durationDays: 1,
      price: 150,
      description: 'Push your ad right back to the top of fresh listings like a brand new post.',
      featuresJson: JSON.stringify([
        'Instantly moves to the top of results',
        'Refreshes posting timestamp',
        'Great boost for older listings',
      ]),
    },
  ];

  for (const pkg of packages) {
    await prisma.promotionPackage.create({ data: pkg });
  }

  console.log('Promotion packages seeded.');

  // 6. Seed Realistic Ads
  const sampleAds = [
    {
      title: 'Toyota Allion G Plus 2019 (Fresh Reconditioned)',
      slug: 'toyota-allion-g-plus-2019-fresh-reconditioned',
      description: 'Original Pearl White Toyota Allion G Plus package, Push Start, Projection HID Headlamps, Beige Interior, Soft-touch AC, Built-in Navigation, Original Mileage 34,000 km, Auction Grade 4.5. First party ownership, all papers updated till Dec 2026. Price slightly negotiable upon physical inspection.',
      price: 2680000,
      isNegotiable: true,
      condition: 'REFURBISHED',
      status: 'APPROVED',
      isFeatured: true,
      isTop: true,
      viewsCount: 1420,
      phoneViewsCount: 48,
      sellerPhone: '01811000003',
      showPhone: true,
      address: 'Gulshan-Tejgaon Link Rd, Dhaka',
      divisionId: locationMap['dhaka'].id,
      districtId: locationMap['dhaka-district'].id,
      areaId: locationMap['gulshan'].id,
      categoryId: categoryMap['vehicles'].id,
      subcategoryId: categoryMap['cars'].id,
      userId: businessSeller1.id,
      images: [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
      ],
      attributes: {
        brand: 'Toyota',
        model: 'Allion G Plus',
        year: '2019',
        fuel: 'Octane',
        transmission: 'Automatic',
        mileage: '34000',
        engine_cc: '1500',
      },
    },
    {
      title: 'iPhone 15 Pro Max 256GB Natural Titanium (BTRC Approved)',
      slug: 'iphone-15-pro-max-256gb-natural-titanium-btrc',
      description: 'Physical Dual SIM variant (LL/A & ZP/A available). 100% Brand new factory sealed box with 1 Year Apple International Warranty and BTRC official registration slip. Instant delivery available across Dhaka via Cash on Delivery.',
      price: 146000,
      isNegotiable: false,
      condition: 'NEW',
      status: 'APPROVED',
      isFeatured: true,
      isUrgent: false,
      viewsCount: 2890,
      phoneViewsCount: 112,
      sellerPhone: '01911000004',
      showPhone: true,
      address: 'Jamuna Future Park, Kuril, Dhaka',
      divisionId: locationMap['dhaka'].id,
      districtId: locationMap['dhaka-district'].id,
      areaId: locationMap['bashundhara'].id,
      categoryId: categoryMap['electronics'].id,
      subcategoryId: categoryMap['mobile-phones'].id,
      userId: businessSeller2.id,
      images: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
      ],
      attributes: {
        brand: 'Apple',
        model: 'iPhone 15 Pro Max',
        storage: '256GB',
        ram: '8GB',
        warranty: '1 Year Official Warranty',
      },
    },
    {
      title: 'Luxury 1850 Sqft 3BHK Apartment in Bashundhara R/A Block C',
      slug: 'luxury-1850-sqft-3bhk-apartment-bashundhara-c',
      description: 'South-facing corner plot apartment. 3 Spacious Bedrooms with attached European-style bathrooms, drawing, dining, family living, 3 large verandas, and maid room with toilet. Generator backup, 2 high-speed lifts, dedicated car parking slot on ground floor. Ready to move immediately.',
      price: 15500000,
      isNegotiable: true,
      condition: 'NEW',
      status: 'APPROVED',
      isFeatured: true,
      isTop: true,
      viewsCount: 3100,
      phoneViewsCount: 95,
      sellerPhone: '01711000001',
      showPhone: true,
      address: 'Road 5, Block C, Bashundhara R/A, Dhaka',
      divisionId: locationMap['dhaka'].id,
      districtId: locationMap['dhaka-district'].id,
      areaId: locationMap['bashundhara'].id,
      categoryId: categoryMap['property'].id,
      subcategoryId: categoryMap['apartments-flats'].id,
      userId: admin.id,
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=80',
      ],
      attributes: {
        property_type: 'Apartment',
        bedrooms: '3',
        bathrooms: '4',
        size_sqft: '1850',
        floor_level: '5th Floor (G+8)',
        furnishing: 'Semi-Furnished',
      },
    },
    {
      title: 'Yamaha R15 V4 Racing Blue (Dual Channel ABS)',
      slug: 'yamaha-r15-v4-racing-blue-dual-abs',
      description: 'Used for only 8 months, odometer only 5,400 km. Showroom condition, not a single scratch. Equipped with Traction Control, Quickshifter, and Bluetooth connectivity. 2 years registration done from Mirpur BRTA.',
      price: 520000,
      isNegotiable: true,
      condition: 'USED',
      status: 'APPROVED',
      isFeatured: false,
      isUrgent: true,
      viewsCount: 1650,
      phoneViewsCount: 42,
      sellerPhone: '01611000005',
      showPhone: true,
      address: 'Mirpur-10, Dhaka',
      divisionId: locationMap['dhaka'].id,
      districtId: locationMap['dhaka-district'].id,
      areaId: locationMap['mirpur'].id,
      categoryId: categoryMap['vehicles'].id,
      subcategoryId: categoryMap['motorcycles'].id,
      userId: regularUser1.id,
      images: [
        'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80',
      ],
      attributes: {
        brand: 'Yamaha',
        model: 'R15 V4',
        year: '2023',
        fuel: 'Octane',
        transmission: 'Manual',
        mileage: '5400',
        engine_cc: '155',
      },
    },
    {
      title: 'MacBook Pro 14 M3 Chip 16GB RAM 512GB SSD Space Gray',
      slug: 'macbook-pro-14-m3-16gb-512gb-space-gray',
      description: 'Battery health 100%, cycle count only 22. Purchased from Star Tech 3 months ago with invoice and remaining 9 months warranty. Selling because company provided a work machine.',
      price: 195000,
      isNegotiable: true,
      condition: 'USED',
      status: 'APPROVED',
      isFeatured: true,
      viewsCount: 920,
      phoneViewsCount: 30,
      sellerPhone: '01911000004',
      showPhone: true,
      address: 'Dhanmondi 27, Dhaka',
      divisionId: locationMap['dhaka'].id,
      districtId: locationMap['dhaka-district'].id,
      areaId: locationMap['dhanmondi'].id,
      categoryId: categoryMap['electronics'].id,
      subcategoryId: categoryMap['laptops-computers'].id,
      userId: businessSeller2.id,
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80',
      ],
      attributes: {
        brand: 'Apple',
        model: 'MacBook Pro 14 (M3)',
        storage: '512GB',
        ram: '16GB',
        warranty: '9 Months Remaining',
      },
    },
    {
      title: 'Solid Chittagong Teak (সেগুন) 6-Seater Dining Table Set',
      slug: 'solid-chittagong-teak-6-seater-dining-table-set',
      description: 'Handcrafted pure Segun wood dining table with 10mm tempered glass top and 6 matching ergonomic chairs with imported Turkish fabric cushions. Used carefully for 1 year in guest dining room.',
      price: 68000,
      isNegotiable: true,
      condition: 'USED',
      status: 'APPROVED',
      isFeatured: false,
      viewsCount: 420,
      phoneViewsCount: 15,
      sellerPhone: '01511000006',
      showPhone: true,
      address: 'Agrabad C/A, Chattogram',
      divisionId: locationMap['chattogram'].id,
      districtId: locationMap['chattogram-district'].id,
      areaId: locationMap['agrabad'].id,
      categoryId: categoryMap['home-living'].id,
      subcategoryId: categoryMap['furniture'].id,
      userId: regularUser2.id,
      images: [
        'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1530629013299-6cb10d168419?w=800&auto=format&fit=crop&q=80',
      ],
      attributes: {
        item_type: 'Dining Table',
        material: '100% CTG Segun Wood',
      },
    },
    {
      title: 'Sony Bravia 55-inch 4K Google Smart TV (KD-55X80L)',
      slug: 'sony-bravia-55-inch-4k-google-smart-tv',
      description: 'Original Malaysia imported Sony Bravia X80L series with Triluminos Pro display, Dolby Vision Atmos, hands-free Google voice assistant. Box, magic remote, and wall mount bracket included.',
      price: 78500,
      isNegotiable: true,
      condition: 'NEW',
      status: 'APPROVED',
      isFeatured: false,
      viewsCount: 550,
      phoneViewsCount: 22,
      sellerPhone: '01911000004',
      showPhone: true,
      address: 'Uttara Sector 11, Dhaka',
      divisionId: locationMap['dhaka'].id,
      districtId: locationMap['dhaka-district'].id,
      areaId: locationMap['uttara'].id,
      categoryId: categoryMap['electronics'].id,
      subcategoryId: categoryMap['tvs-appliances'].id,
      userId: businessSeller2.id,
      images: [
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80',
      ],
      attributes: {
        brand: 'Sony',
        model: 'KD-55X80L',
        warranty: '2 Years Panel Warranty',
      },
    },
    {
      title: 'High-Yield Dairy Cow (Holstein Friesian Cross 2nd Lactation)',
      slug: 'high-yield-dairy-cow-holstein-friesian-cross',
      description: 'Healthy and calm Holstein Friesian cross milk cow. Currently giving 18-20 liters of milk daily. Vaccinated and dewormed regularly with vet health clearance certificate.',
      price: 245000,
      isNegotiable: true,
      condition: 'USED',
      status: 'APPROVED',
      isFeatured: false,
      isUrgent: true,
      viewsCount: 780,
      phoneViewsCount: 38,
      sellerPhone: '01611000005',
      showPhone: true,
      address: 'Natullabad, Barishal',
      divisionId: locationMap['barishal'].id,
      districtId: locationMap['barishal-district'].id,
      areaId: locationMap['natullabad'].id,
      categoryId: categoryMap['agriculture'].id,
      subcategoryId: categoryMap['livestock-poultry'].id,
      userId: regularUser1.id,
      images: [
        'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80',
      ],
      attributes: {},
    },
  ];

  for (const adData of sampleAds) {
    const { images, attributes, ...adFields } = adData;
    const createdAd = await prisma.ad.create({
      data: adFields,
    });

    // Images
    for (let i = 0; i < images.length; i++) {
      await prisma.adImage.create({
        data: {
          adId: createdAd.id,
          url: images[i],
          isCover: i === 0,
          order: i,
        },
      });
    }

    // Dynamic Attributes
    for (const [key, value] of Object.entries(attributes)) {
      await prisma.adAttribute.create({
        data: {
          adId: createdAd.id,
          fieldKey: key,
          value: String(value),
        },
      });
    }
  }

  console.log('Sample ads seeded.');

  // 7. Seed Reviews
  await prisma.review.create({
    data: {
      reviewerId: regularUser1.id,
      sellerId: businessSeller1.id,
      rating: 5,
      comment: 'Excellent service! Bought a Toyota Premio from Navana Motors. Papers were 100% genuine and car was exactly as described.',
      reply: 'Thank you Rahim bhai! Wish you safe journeys with your family.',
    },
  });

  await prisma.review.create({
    data: {
      reviewerId: regularUser2.id,
      sellerId: businessSeller2.id,
      rating: 5,
      comment: 'Got my iPhone 15 Pro Max delivered within 2 hours in Dhanmondi. Box was original sealed and BTRC registered. Highly recommended!',
      reply: 'Glad you loved the quick delivery Nusrat apu!',
    },
  });

  console.log('Reviews seeded.');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
