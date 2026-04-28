# SabaiSale Product Seeder — Run: .\add-products.ps1
$BASE = "https://sabaisales.onrender.com/api"

Write-Host "Logging in..." -ForegroundColor Cyan
$login = Invoke-RestMethod -Uri "$BASE/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"jeevan@sabaisale.com","password":"Jeevan@Sabaisale"}'
$TOKEN = $login.token
$headers = @{ "Authorization" = "Bearer $TOKEN"; "Content-Type" = "application/json" }
Write-Host "Logged in as admin!" -ForegroundColor Green

Write-Host "Getting categories..." -ForegroundColor Cyan
$cats = Invoke-RestMethod -Uri "$BASE/categories" -Method GET
$catMap = @{}
foreach ($c in $cats.categories) { $catMap[$c.name] = $c._id }
Write-Host "Categories: $($catMap.Keys -join ', ')" -ForegroundColor Green

$products = @(
  @{ name="Apple MacBook Pro 14 M3"; price=185000; originalPrice=210000; category=$catMap["Electronics"]; image="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600"; description="M3 Pro chip, 18GB RAM, 512GB SSD. Most powerful MacBook ever built."; brand="Apple"; stock=15; featured=$true; tags=@("laptop","apple","macbook") },
  @{ name="Samsung Galaxy S24 Ultra"; price=145000; originalPrice=165000; category=$catMap["Electronics"]; image="https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600"; description="200MP camera, S Pen, 12GB RAM. Ultimate Android flagship."; brand="Samsung"; stock=25; featured=$true; tags=@("phone","samsung") },
  @{ name="Sony WH-1000XM5 Headphones"; price=32000; originalPrice=38000; category=$catMap["Electronics"]; image="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600"; description="Industry-leading noise cancellation, 30-hour battery."; brand="Sony"; stock=40; featured=$true; tags=@("headphones","audio") },
  @{ name="iPhone 15 Pro Max"; price=175000; originalPrice=195000; category=$catMap["Electronics"]; image="https://images.unsplash.com/photo-1695048133142-1a20484428d1?w=600"; description="Titanium design, A17 Pro chip, 48MP ProRAW camera."; brand="Apple"; stock=20; featured=$true; tags=@("phone","apple","iphone") },
  @{ name="AirPods Pro 2nd Gen"; price=28000; originalPrice=32000; category=$catMap["Electronics"]; image="https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=600"; description="Active noise cancellation, Adaptive Audio, MagSafe charging."; brand="Apple"; stock=45; featured=$true; tags=@("earbuds","apple") },
  @{ name="iPad Pro 12.9 M2"; price=120000; originalPrice=135000; category=$catMap["Electronics"]; image="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600"; description="M2 chip, Liquid Retina XDR, Apple Pencil support."; brand="Apple"; stock=20; featured=$false; tags=@("tablet","apple") },
  @{ name="Dell XPS 15 Laptop"; price=165000; originalPrice=185000; category=$catMap["Electronics"]; image="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600"; description="Intel i7 13th Gen, OLED display, 32GB RAM, 1TB SSD."; brand="Dell"; stock=10; featured=$false; tags=@("laptop","dell") },
  @{ name="Apple Watch Series 9"; price=55000; originalPrice=62000; category=$catMap["Electronics"]; image="https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600"; description="Advanced health monitoring, always-on display, crash detection."; brand="Apple"; stock=30; featured=$false; tags=@("smartwatch","apple") },
  @{ name="LG OLED 55 inch 4K TV"; price=175000; originalPrice=210000; category=$catMap["Electronics"]; image="https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600"; description="Perfect blacks, 120Hz, Dolby Vision, WebOS smart TV."; brand="LG"; stock=8; featured=$false; tags=@("tv","lg") },
  @{ name="Nintendo Switch OLED"; price=42000; originalPrice=48000; category=$catMap["Electronics"]; image="https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600"; description="7 inch OLED screen, enhanced audio, 64GB storage."; brand="Nintendo"; stock=35; featured=$false; tags=@("gaming","console") },
  @{ name="Canon EOS R50 Camera"; price=82000; originalPrice=95000; category=$catMap["Electronics"]; image="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600"; description="24.2MP APS-C, 4K video, perfect for content creators."; brand="Canon"; stock=12; featured=$false; tags=@("camera","photography") },
  @{ name="JBL Charge 5 Speaker"; price=18000; originalPrice=22000; category=$catMap["Electronics"]; image="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600"; description="IP67 waterproof, 20-hour battery, PartyBoost feature."; brand="JBL"; stock=50; featured=$false; tags=@("speaker","bluetooth") },
  @{ name="Logitech MX Master 3S Mouse"; price=12500; originalPrice=14500; category=$catMap["Electronics"]; image="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600"; description="8K DPI, 70-day battery, ergonomic design for professionals."; brand="Logitech"; stock=60; featured=$false; tags=@("mouse","peripheral") },
  @{ name="DJI Mini 4 Pro Drone"; price=95000; originalPrice=110000; category=$catMap["Electronics"]; image="https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600"; description="4K 60fps, 34min flight, omnidirectional obstacle sensing."; brand="DJI"; stock=7; featured=$false; tags=@("drone","aerial") },
  @{ name="Samsung Galaxy Tab S9"; price=78000; originalPrice=92000; category=$catMap["Electronics"]; image="https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?w=600"; description="AMOLED display, Snapdragon 8 Gen 2, S Pen included."; brand="Samsung"; stock=18; featured=$false; tags=@("tablet","samsung") },
  @{ name="Nike Air Max 270"; price=15000; originalPrice=18000; category=$catMap["Fashion"]; image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"; description="Iconic Air Max unit, breathable mesh upper, all-day comfort."; brand="Nike"; stock=60; featured=$true; tags=@("shoes","nike") },
  @{ name="Adidas Ultraboost 23"; price=17500; originalPrice=21000; category=$catMap["Fashion"]; image="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600"; description="BOOST cushioning, Primeknit upper, best running shoe."; brand="Adidas"; stock=45; featured=$true; tags=@("shoes","running") },
  @{ name="The North Face Puffer Jacket"; price=22000; originalPrice=28000; category=$catMap["Fashion"]; image="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600"; description="700-fill goose down, DWR finish, ideal for Nepal winters."; brand="The North Face"; stock=30; featured=$true; tags=@("jacket","winter") },
  @{ name="Levis 501 Original Jeans"; price=7500; originalPrice=9000; category=$catMap["Fashion"]; image="https://images.unsplash.com/photo-1542272604-787c3835535d?w=600"; description="Classic straight fit, 100% cotton denim, timeless style."; brand="Levis"; stock=80; featured=$false; tags=@("jeans","denim") },
  @{ name="Converse Chuck Taylor All Star"; price=8000; originalPrice=9500; category=$catMap["Fashion"]; image="https://images.unsplash.com/photo-1494496195158-c3becb4f2475?w=600"; description="Classic canvas high-top, vulcanized sole, iconic design."; brand="Converse"; stock=70; featured=$false; tags=@("shoes","casual") },
  @{ name="Tommy Hilfiger Premium Hoodie"; price=9500; originalPrice=12000; category=$catMap["Fashion"]; image="https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600"; description="Signature logo, premium fleece, relaxed comfortable fit."; brand="Tommy Hilfiger"; stock=50; featured=$false; tags=@("hoodie","casual") },
  @{ name="Puma RS-X Sneakers"; price=11000; originalPrice=13500; category=$catMap["Fashion"]; image="https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600"; description="Retro chunky sole, multi-layer upper, bold streetwear look."; brand="Puma"; stock=35; featured=$false; tags=@("shoes","sneakers") },
  @{ name="Polo Ralph Lauren Shirt"; price=8500; originalPrice=10000; category=$catMap["Fashion"]; image="https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600"; description="Classic polo, pique cotton, embroidered pony logo."; brand="Ralph Lauren"; stock=100; featured=$false; tags=@("shirt","polo") },
  @{ name="Lululemon Align Yoga Set"; price=14500; originalPrice=17000; category=$catMap["Fashion"]; image="https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600"; description="Buttery-soft fabric, 4-way stretch, perfect for yoga and gym."; brand="Lululemon"; stock=25; featured=$false; tags=@("yoga","activewear") },
  @{ name="Uniqlo Ultra Light Down Jacket"; price=6500; originalPrice=8000; category=$catMap["Fashion"]; image="https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600"; description="Ultra light, packable, exceptional warmth-to-weight ratio."; brand="Uniqlo"; stock=40; featured=$false; tags=@("jacket","light") },
  @{ name="Dyson V15 Detect Vacuum"; price=65000; originalPrice=78000; category=$catMap["Home"]; image="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"; description="Laser dust detection, HEPA filter, 60-minute cordless cleaning."; brand="Dyson"; stock=15; featured=$true; tags=@("vacuum","cleaning") },
  @{ name="Instant Pot Duo 7-in-1"; price=18000; originalPrice=22000; category=$catMap["Home"]; image="https://images.unsplash.com/photo-1585515320310-259814833e62?w=600"; description="Pressure cooker, slow cooker, rice cooker, and more. 6-quart."; brand="Instant Pot"; stock=30; featured=$true; tags=@("kitchen","cooking") },
  @{ name="Nespresso Vertuo Coffee Maker"; price=22000; originalPrice=26000; category=$catMap["Home"]; image="https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600"; description="Centrifusion tech, 5 cup sizes, one-touch brewing system."; brand="Nespresso"; stock=20; featured=$false; tags=@("coffee","kitchen") },
  @{ name="Philips Hue Smart Bulb Set"; price=8500; originalPrice=10000; category=$catMap["Home"]; image="https://images.unsplash.com/photo-1558618047-3c9b68e3fa21?w=600"; description="16M colors, Alexa and Google Home compatible, 4-pack."; brand="Philips"; stock=60; featured=$false; tags=@("smart home","lighting") },
  @{ name="Himalayan Salt Lamp Large"; price=2500; originalPrice=3200; category=$catMap["Home"]; image="https://images.unsplash.com/photo-1544829832-e8d14a44cd8b?w=600"; description="Natural crystal salt, warm amber glow, air purifying properties."; brand="Himalayan Art"; stock=100; featured=$false; tags=@("lamp","decor") },
  @{ name="MUJI Ultrasonic Diffuser"; price=7500; originalPrice=9000; category=$catMap["Home"]; image="https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600"; description="Ultrasonic mist, timer, auto shut-off, available in 3 colors."; brand="MUJI"; stock=40; featured=$false; tags=@("diffuser","wellness") },
  @{ name="Le Creuset 5.5Qt Dutch Oven"; price=35000; originalPrice=42000; category=$catMap["Home"]; image="https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=600"; description="Enameled cast iron, lifetime warranty, oven safe to 500F."; brand="Le Creuset"; stock=12; featured=$false; tags=@("cookware","kitchen") },
  @{ name="iRobot Roomba j7 Robot"; price=85000; originalPrice=99000; category=$catMap["Home"]; image="https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=600"; description="Smart mapping, obstacle avoidance, self-emptying base."; brand="iRobot"; stock=8; featured=$true; tags=@("robot","vacuum") },
  @{ name="Casper Cooling Pillow"; price=5500; originalPrice=6800; category=$catMap["Home"]; image="https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600"; description="Cooling tech, adjustable fill, perfect spinal support."; brand="Casper"; stock=80; featured=$false; tags=@("pillow","bedroom") },
  @{ name="Wooden Industrial Bookshelf"; price=14500; originalPrice=18000; category=$catMap["Home"]; image="https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600"; description="Solid wood, 5-tier, industrial pipe accents, rustic modern."; brand="HomeVibe"; stock=18; featured=$false; tags=@("furniture","storage") },
  @{ name="Ray-Ban Aviator Classic"; price=16500; originalPrice=19000; category=$catMap["Accessories"]; image="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600"; description="Gold frame, G-15 lenses, 100% UV protection, iconic design."; brand="Ray-Ban"; stock=40; featured=$true; tags=@("sunglasses","eyewear") },
  @{ name="Herschel Little America Pack"; price=11500; originalPrice=14000; category=$catMap["Accessories"]; image="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"; description="25L capacity, laptop sleeve, striped lining, durable poly."; brand="Herschel"; stock=30; featured=$true; tags=@("backpack","travel") },
  @{ name="Casio G-Shock GA-2100"; price=12000; originalPrice=15000; category=$catMap["Accessories"]; image="https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600"; description="Shock resistant, 20-bar water resistance, solar powered."; brand="Casio"; stock=50; featured=$false; tags=@("watch","gshock") },
  @{ name="Genuine Leather Messenger Bag"; price=9500; originalPrice=12000; category=$catMap["Accessories"]; image="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600"; description="Full-grain leather, 15 inch laptop slot, adjustable strap."; brand="CraftLeather"; stock=25; featured=$false; tags=@("bag","leather") },
  @{ name="RFID Slim Leather Wallet"; price=3500; originalPrice=4500; category=$catMap["Accessories"]; image="https://images.unsplash.com/photo-1627123424574-724758594785?w=600"; description="Full-grain leather, RFID blocking, 8 card slots, ultra slim."; brand="SlimCarry"; stock=80; featured=$false; tags=@("wallet","leather") },
  @{ name="Longchamp Le Pliage Tote"; price=14500; originalPrice=17000; category=$catMap["Accessories"]; image="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600"; description="Foldable nylon and leather, 13 inch laptop fit, iconic French."; brand="Longchamp"; stock=22; featured=$false; tags=@("tote","bag") },
  @{ name="Natural Gemstone Bracelet Set"; price=1500; originalPrice=2000; category=$catMap["Accessories"]; image="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600"; description="Stackable set of 5, natural stones, unisex design."; brand="Stone Co"; stock=120; featured=$false; tags=@("bracelet","jewelry") },
  @{ name="Titanium Wedding Band"; price=8000; originalPrice=10000; category=$catMap["Accessories"]; image="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600"; description="Lightweight titanium, brushed finish, comfort-fit, sizes 6-13."; brand="JewelCraft"; stock=30; featured=$false; tags=@("ring","jewelry") },
  @{ name="Silk Twill Scarf 90x90"; price=4500; originalPrice=5800; category=$catMap["Accessories"]; image="https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600"; description="100% silk, hand-rolled edges, versatile styling options."; brand="SilkLux"; stock=45; featured=$false; tags=@("scarf","silk") },
  @{ name="Full-Grain Leather Belt"; price=2800; originalPrice=3500; category=$catMap["Accessories"]; image="https://images.unsplash.com/photo-1594938298603-c8148c4b4de7?w=600"; description="Pebble leather, brass buckle, 35mm width, multiple sizes."; brand="BeltCo"; stock=70; featured=$false; tags=@("belt","leather") }
)

Write-Host "Adding $($products.Count) products..." -ForegroundColor Cyan
$success = 0; $failed = 0

foreach ($p in $products) {
  try {
    $body = $p | ConvertTo-Json -Depth 5
    Invoke-RestMethod -Uri "$BASE/products" -Method POST -Headers $headers -Body $body | Out-Null
    Write-Host "  Added: $($p.name)" -ForegroundColor Green
    $success++
  } catch {
    Write-Host "  Failed: $($p.name)" -ForegroundColor Red
    $failed++
  }
  Start-Sleep -Milliseconds 200
}

Write-Host ""
Write-Host "Done! Added: $success | Failed: $failed" -ForegroundColor Cyan
Write-Host "Visit: https://sabaisale.vercel.app" -ForegroundColor Yellow
