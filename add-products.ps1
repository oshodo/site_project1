# SabaiSale - Add Products to Render API
# Run: .\add-products.ps1

$BASE = "https://sabaisale.onrender.com/api"

Write-Host "Logging in as admin..." -ForegroundColor Cyan
$login = Invoke-RestMethod -Uri "$BASE/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@sabaisale.com","password":"Jeevan@Sabaisale"}'
$TOKEN = $login.token
Write-Host "Logged in!" -ForegroundColor Green

$headers = @{ "Authorization" = "Bearer $TOKEN"; "Content-Type" = "application/json" }

Write-Host "Getting categories..." -ForegroundColor Cyan
$cats = Invoke-RestMethod -Uri "$BASE/categories" -Method GET
$catMap = @{}
foreach ($c in $cats.categories) { $catMap[$c.name] = $c._id }

Write-Host "Categories found: $($catMap.Keys -join ', ')" -ForegroundColor Green

$products = @(
  # Electronics
  @{ name="Apple MacBook Pro 14 inch"; price=185000; originalPrice=210000; category=$catMap["Electronics"]; image="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600"; description="M3 Pro chip, 18GB RAM, 512GB SSD. The most powerful MacBook ever."; brand="Apple"; stock=15; rating=4.9; numReviews=128; featured=$true; tags=@("laptop","apple","macbook") },
  @{ name="Samsung Galaxy S24 Ultra"; price=145000; originalPrice=165000; category=$catMap["Electronics"]; image="https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600"; description="200MP camera, built-in S Pen, 12GB RAM. Flagship Android phone."; brand="Samsung"; stock=25; rating=4.8; numReviews=203; featured=$true; tags=@("phone","samsung","android") },
  @{ name="Sony WH-1000XM5 Headphones"; price=32000; originalPrice=38000; category=$catMap["Electronics"]; image="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600"; description="Industry-leading noise cancellation with 30-hour battery life."; brand="Sony"; stock=40; rating=4.9; numReviews=456; featured=$true; tags=@("headphones","sony","audio") },
  @{ name="iPhone 15 Pro"; price=155000; originalPrice=175000; category=$catMap["Electronics"]; image="https://images.unsplash.com/photo-1695048133142-1a20484428d1?w=600"; description="Titanium design, A17 Pro chip, 48MP camera system."; brand="Apple"; stock=20; rating=4.9; numReviews=567; featured=$true; tags=@("phone","apple","iphone") },
  @{ name="AirPods Pro 2nd Gen"; price=28000; originalPrice=32000; category=$catMap["Electronics"]; image="https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=600"; description="Active noise cancellation, adaptive audio, MagSafe charging."; brand="Apple"; stock=45; rating=4.8; numReviews=678; featured=$true; tags=@("earbuds","apple","audio") },
  @{ name="Apple Watch Series 9"; price=55000; originalPrice=62000; category=$catMap["Electronics"]; image="https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600"; description="Advanced health monitoring, crash detection, always-on display."; brand="Apple"; stock=30; rating=4.8; numReviews=234; featured=$false; tags=@("smartwatch","apple","wearable") },
  @{ name="iPad Pro 12.9 inch"; price=120000; originalPrice=135000; category=$catMap["Electronics"]; image="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600"; description="M2 chip, Liquid Retina XDR display, Apple Pencil support."; brand="Apple"; stock=20; rating=4.8; numReviews=89; featured=$false; tags=@("tablet","apple","ipad") },
  @{ name="LG OLED 55 inch TV"; price=175000; originalPrice=210000; category=$catMap["Electronics"]; image="https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600"; description="Perfect blacks, stunning colors, 120Hz for gaming and movies."; brand="LG"; stock=8; rating=4.9; numReviews=112; featured=$false; tags=@("tv","lg","oled") },
  @{ name="JBL Charge 5 Speaker"; price=18000; originalPrice=22000; category=$catMap["Electronics"]; image="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600"; description="IP67 waterproof, 20-hour playtime, party boost feature."; brand="JBL"; stock=50; rating=4.6; numReviews=178; featured=$false; tags=@("speaker","jbl","bluetooth") },
  @{ name="Logitech MX Master 3S"; price=12500; originalPrice=14500; category=$catMap["Electronics"]; image="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600"; description="Ultra-precise 8K DPI sensor, 70-day battery, ergonomic design."; brand="Logitech"; stock=60; rating=4.8; numReviews=234; featured=$false; tags=@("mouse","logitech","peripheral") },
  @{ name="Nintendo Switch OLED"; price=42000; originalPrice=48000; category=$catMap["Electronics"]; image="https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600"; description="Vibrant 7 inch OLED screen, enhanced audio, 64GB storage."; brand="Nintendo"; stock=35; rating=4.7; numReviews=389; featured=$false; tags=@("gaming","nintendo","console") },
  @{ name="Canon EOS R50 Camera"; price=82000; originalPrice=95000; category=$catMap["Electronics"]; image="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600"; description="24.2MP APS-C sensor, 4K video, perfect for creators."; brand="Canon"; stock=12; rating=4.6; numReviews=45; featured=$false; tags=@("camera","canon","photography") },
  # Fashion
  @{ name="Nike Air Max 270"; price=15000; originalPrice=18000; category=$catMap["Fashion"]; image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"; description="Iconic Air Max unit, breathable mesh upper, all-day comfort."; brand="Nike"; stock=60; rating=4.7; numReviews=345; featured=$true; tags=@("shoes","nike","sneakers") },
  @{ name="Adidas Ultraboost 23"; price=17500; originalPrice=21000; category=$catMap["Fashion"]; image="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600"; description="BOOST cushioning, Primeknit upper, responsive running shoe."; brand="Adidas"; stock=45; rating=4.8; numReviews=189; featured=$true; tags=@("shoes","adidas","running") },
  @{ name="The North Face Puffer Jacket"; price=22000; originalPrice=28000; category=$catMap["Fashion"]; image="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600"; description="700-fill goose down, DWR finish, perfect for Himalayan winters."; brand="The North Face"; stock=30; rating=4.8; numReviews=167; featured=$true; tags=@("jacket","northface","winter") },
  @{ name="Levis 501 Original Jeans"; price=7500; originalPrice=9000; category=$catMap["Fashion"]; image="https://images.unsplash.com/photo-1542272604-787c3835535d?w=600"; description="Classic straight fit, 100% cotton denim, timeless design."; brand="Levis"; stock=80; rating=4.6; numReviews=234; featured=$false; tags=@("jeans","levis","denim") },
  @{ name="Polo Ralph Lauren Shirt"; price=8500; originalPrice=10000; category=$catMap["Fashion"]; image="https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600"; description="Classic polo shirt, pique cotton, embroidered pony logo."; brand="Ralph Lauren"; stock=100; rating=4.5; numReviews=123; featured=$false; tags=@("shirt","polo","fashion") },
  @{ name="Converse Chuck Taylor High"; price=8000; originalPrice=9500; category=$catMap["Fashion"]; image="https://images.unsplash.com/photo-1494496195158-c3becb4f2475?w=600"; description="Classic canvas high-top, vulcanized rubber sole, iconic design."; brand="Converse"; stock=70; rating=4.6; numReviews=412; featured=$false; tags=@("shoes","converse","classic") },
  @{ name="Tommy Hilfiger Hoodie"; price=9500; originalPrice=12000; category=$catMap["Fashion"]; image="https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600"; description="Signature logo, premium fleece cotton blend, relaxed fit."; brand="Tommy Hilfiger"; stock=50; rating=4.6; numReviews=134; featured=$false; tags=@("hoodie","tommy","casual") },
  @{ name="Lululemon Yoga Set"; price=14500; originalPrice=17000; category=$catMap["Fashion"]; image="https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600"; description="Moisture-wicking fabric, 4-way stretch, perfect for yoga and gym."; brand="Lululemon"; stock=25; rating=4.8; numReviews=89; featured=$false; tags=@("yoga","lululemon","activewear") },
  @{ name="Puma RS-X Sneakers"; price=11000; originalPrice=13500; category=$catMap["Fashion"]; image="https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600"; description="Retro-inspired chunky sole, multi-layered mesh upper, bold colorway."; brand="Puma"; stock=35; rating=4.5; numReviews=78; featured=$false; tags=@("shoes","puma","sneakers") },
  # Home
  @{ name="Dyson V15 Vacuum"; price=65000; originalPrice=78000; category=$catMap["Home"]; image="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"; description="Laser dust detection, HEPA filtration, 60-min run time."; brand="Dyson"; stock=15; rating=4.9; numReviews=167; featured=$true; tags=@("vacuum","dyson","cleaning") },
  @{ name="Instant Pot Duo 7-in-1"; price=18000; originalPrice=22000; category=$catMap["Home"]; image="https://images.unsplash.com/photo-1585515320310-259814833e62?w=600"; description="Pressure cooker, slow cooker, rice cooker and more. 6-quart."; brand="Instant Pot"; stock=30; rating=4.8; numReviews=567; featured=$true; tags=@("kitchen","cooking","appliance") },
  @{ name="Nespresso Vertuo Coffee"; price=22000; originalPrice=26000; category=$catMap["Home"]; image="https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600"; description="Centrifusion extraction, 5 cup sizes, smart one-touch system."; brand="Nespresso"; stock=20; rating=4.7; numReviews=298; featured=$false; tags=@("coffee","nespresso","kitchen") },
  @{ name="Philips Hue Smart Bulb Set"; price=8500; originalPrice=10000; category=$catMap["Home"]; image="https://images.unsplash.com/photo-1558618047-3c9b68e3fa21?w=600"; description="16 million colors, works with Alexa and Google Home, 4-pack."; brand="Philips"; stock=60; rating=4.7; numReviews=345; featured=$false; tags=@("smart home","philips","lighting") },
  @{ name="Roomba j7 Robot Vacuum"; price=85000; originalPrice=99000; category=$catMap["Home"]; image="https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=600"; description="Smart mapping, avoids obstacles, self-emptying base included."; brand="iRobot"; stock=8; rating=4.8; numReviews=145; featured=$true; tags=@("robot","vacuum","smart home") },
  @{ name="Le Creuset Dutch Oven"; price=35000; originalPrice=42000; category=$catMap["Home"]; image="https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=600"; description="Enameled cast iron, 5.5 quart, lifetime warranty, oven safe."; brand="Le Creuset"; stock=12; rating=4.9; numReviews=234; featured=$false; tags=@("cookware","kitchen") },
  @{ name="Himalayan Salt Lamp"; price=2500; originalPrice=3200; category=$catMap["Home"]; image="https://images.unsplash.com/photo-1544829832-e8d14a44cd8b?w=600"; description="Natural Himalayan crystal, warm amber glow, air purifying."; brand="Himalayan Art"; stock=100; rating=4.5; numReviews=456; featured=$false; tags=@("lamp","decor","himalayan") },
  @{ name="Casper Sleep Pillow"; price=5500; originalPrice=6800; category=$catMap["Home"]; image="https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600"; description="Cooling technology, adjustable fill, perfect spinal alignment."; brand="Casper"; stock=80; rating=4.6; numReviews=189; featured=$false; tags=@("pillow","sleep","bedroom") },
  @{ name="MUJI Aromatherapy Diffuser"; price=7500; originalPrice=9000; category=$catMap["Home"]; image="https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600"; description="Ultrasonic diffuser, timer function, auto shut-off, 3 colors."; brand="MUJI"; stock=40; rating=4.7; numReviews=123; featured=$false; tags=@("diffuser","muji","wellness") },
  @{ name="Wooden Bookshelf 5-Tier"; price=14500; originalPrice=18000; category=$catMap["Home"]; image="https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600"; description="Solid wood, industrial pipe design, 5-tier with metal accents."; brand="HomeVibe"; stock=18; rating=4.5; numReviews=67; featured=$false; tags=@("bookshelf","furniture","wood") },
  # Accessories
  @{ name="Ray-Ban Aviator Classic"; price=16500; originalPrice=19000; category=$catMap["Accessories"]; image="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600"; description="Gold metal frame, classic G-15 green lenses, 100% UV protection."; brand="Ray-Ban"; stock=40; rating=4.8; numReviews=289; featured=$true; tags=@("sunglasses","rayban","eyewear") },
  @{ name="Herschel Little America Backpack"; price=11500; originalPrice=14000; category=$catMap["Accessories"]; image="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"; description="25L capacity, laptop sleeve, signature striped lining, durable poly."; brand="Herschel"; stock=30; rating=4.7; numReviews=234; featured=$true; tags=@("backpack","herschel","travel") },
  @{ name="Casio G-Shock Watch"; price=12000; originalPrice=15000; category=$catMap["Accessories"]; image="https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600"; description="Shock resistant, 20-bar water resistance, solar powered, tough."; brand="Casio"; stock=50; rating=4.7; numReviews=567; featured=$false; tags=@("watch","casio","gshock") },
  @{ name="Leather Messenger Bag"; price=9500; originalPrice=12000; category=$catMap["Accessories"]; image="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600"; description="Genuine leather, 15 inch laptop compartment, adjustable strap."; brand="CraftLeather"; stock=25; rating=4.7; numReviews=134; featured=$false; tags=@("bag","leather","laptop bag") },
  @{ name="Leather Wallet Slim"; price=3500; originalPrice=4500; category=$catMap["Accessories"]; image="https://images.unsplash.com/photo-1627123424574-724758594785?w=600"; description="Full-grain leather, RFID blocking, 8 card slots, minimal profile."; brand="SlimCarry"; stock=80; rating=4.6; numReviews=345; featured=$false; tags=@("wallet","leather","rfid") },
  @{ name="Titanium Wedding Band"; price=8000; originalPrice=10000; category=$catMap["Accessories"]; image="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600"; description="Lightweight titanium, brushed finish, comfort-fit band, sizes 6-13."; brand="JewelCraft"; stock=30; rating=4.6; numReviews=56; featured=$false; tags=@("ring","titanium","jewelry") },
  @{ name="Longchamp Le Pliage Tote"; price=14500; originalPrice=17000; category=$catMap["Accessories"]; image="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600"; description="Iconic foldable design, nylon and leather, fits laptop up to 13 inch."; brand="Longchamp"; stock=22; rating=4.7; numReviews=234; featured=$false; tags=@("tote","longchamp","bag") },
  @{ name="Beaded Bracelet Set"; price=1500; originalPrice=2000; category=$catMap["Accessories"]; image="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600"; description="Natural gemstone beads, stackable set of 5, unisex design."; brand="Stone and Co"; stock=120; rating=4.4; numReviews=189; featured=$false; tags=@("bracelet","gemstone","jewelry") },
  @{ name="Pebble Leather Belt"; price=2800; originalPrice=3500; category=$catMap["Accessories"]; image="https://images.unsplash.com/photo-1594938298603-c8148c4b4de7?w=600"; description="Full-grain pebble leather, solid brass buckle, 35mm width."; brand="BeltCo"; stock=70; rating=4.4; numReviews=45; featured=$false; tags=@("belt","leather","men") },
  @{ name="Silk Scarf 90x90"; price=4500; originalPrice=5800; category=$catMap["Accessories"]; image="https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600"; description="100% silk twill, hand-rolled edges, versatile style for neck or hair."; brand="SilkLux"; stock=45; rating=4.5; numReviews=78; featured=$false; tags=@("scarf","silk","women") }
)

Write-Host "Adding $($products.Count) products..." -ForegroundColor Cyan

$success = 0
$failed = 0

foreach ($p in $products) {
  try {
    $body = $p | ConvertTo-Json -Depth 5
    $result = Invoke-RestMethod -Uri "$BASE/products" -Method POST -Headers $headers -Body $body
    Write-Host "  Added: $($p.name)" -ForegroundColor Green
    $success++
  } catch {
    Write-Host "  Failed: $($p.name) - $_" -ForegroundColor Red
    $failed++
  }
  Start-Sleep -Milliseconds 300
}

Write-Host ""
Write-Host "Done! Added: $success | Failed: $failed" -ForegroundColor Cyan
Write-Host "Visit: http://localhost:5173" -ForegroundColor Yellow
