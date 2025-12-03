<template>
  <footer class="footer">
    <div class="footer-main py-5 px-3">
      <div class="container" style="max-width: 1400px;">
        <div class="row gx-5">
          <!-- Brand Section -->
          <div class="col-lg-3 col-md-6 mb-4 mb-lg-0">
            <div class="d-flex align-items-center gap-2 mb-3">
              <img class="rounded-circle" src="/logo.png" alt="logo image" style="width: 40px; height: 40px; object-fit: cover; filter: brightness(0) saturate(100%) invert(15%) sepia(18%) saturate(1285%) hue-rotate(183deg) brightness(95%) contrast(92%);">
              <span class="fw-bold text-dark" style="font-size: 18px;">StationeryHub</span>
            </div>
            <p class="text-secondary mb-4" style="font-size: 13px; line-height: 1.7; max-width: 280px;">
              Premium stationery and office supplies for creative minds and organized professionals.
            </p>
            <div class="d-flex gap-2">
              <a href="#" class="social-icon">
                <img src="/facebook.png" alt="facebook" style="width: 18px; height: 18px;">
              </a>
              <a href="#" class="social-icon">
                <img src="/instagram.png" alt="instagram" style="width: 18px; height: 18px;">
              </a>
              <a href="#" class="social-icon">
                <img src="/twitter.png" alt="twitter" style="width: 18px; height: 18px;">
              </a>
            </div>
          </div>

          <!-- Shop Links -->
          <div class="col-lg-2 col-md-6 col-6 mb-4 mb-lg-0">
            <h6 class="fw-bold text-dark mb-3" style="font-size: 15px;">Shop</h6>
            <ul class="list-unstyled">
              <li class="mb-2"><a href="#" class="footer-link">All Products</a></li>
              <li class="mb-2"><a href="#" class="footer-link">New Arrival</a></li>
              <li class="mb-2"><a href="#" class="footer-link">Categories</a></li>
              <li class="mb-2"><a href="#" class="footer-link">Hots</a></li>
            </ul>
          </div>

          <!-- Support Links -->
          <div class="col-lg-2 col-md-6 col-6 mb-4 mb-lg-0">
            <h6 class="fw-bold text-dark mb-3" style="font-size: 15px;">Support</h6>
            <ul class="list-unstyled">
              <li class="mb-2"><a href="#" class="footer-link">Contact Us</a></li>
              <li class="mb-2"><a href="#" class="footer-link">FAQ</a></li>
              <li class="mb-2"><a href="#" class="footer-link">Shipping Info</a></li>
              <li class="mb-2"><a href="#" class="footer-link">Returns</a></li>
            </ul>
          </div>

          <!-- Reach Us -->
          <div class="col-lg-2 col-md-6 mb-4 mb-lg-0">
            <h6 class="fw-bold text-dark mb-3" style="font-size: 15px;">Reach Us</h6>
            <div class="d-flex align-items-start gap-2 mb-3">
              <img src="/call.png" alt="phone" style="width: 16px; height: 16px; margin-top: 2px;">
              <span class="text-secondary" style="font-size: 13px;">(+971) 58 8284186</span>
            </div>
            <div class="d-flex align-items-start gap-2">
              <img src="/location.png" alt="location" style="width: 16px; height: 16px; margin-top: 2px;">
              <a href="#" class="footer-link">View Store Location</a>
            </div>
          </div>

          <!-- Newsletter -->
          <div class="col-lg-3 col-md-6">
            <h6 class="fw-bold text-dark mb-3" style="font-size: 15px;">Newsletter</h6>
            <p class="text-secondary mb-3" style="font-size: 13px; line-height: 1.6;">
              Subscribe to get special offers and updates.
            </p>
            <div class="input-group input-group-sm">
              <input 
                type="email" 
                class="form-control border-end-0" 
                placeholder="Enter your email" 
                style="font-size: 13px; padding: 8px 12px; background: white; border-color: #dee2e6;"
              >
              <button class="btn btn-teal px-3" type="submit">
                <img src="/email.png" alt="send" style="width: 16px; height: 16px; filter: brightness(0) invert(1);">
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="footer-bottom py-3 px-3">
      <div class="container" style="max-width: 1400px;">
        <div class="row align-items-center">
          <div class="col-md-6 text-center text-md-start mb-2 mb-md-0">
            <p class="mb-0 text-light" style="font-size: 12px;">© 2025 StationeryHub. All rights reserved.</p>
          </div>
          <div class="col-md-6">
            <div class="d-flex gap-4 justify-content-center justify-content-md-end">
              <a href="#" class="footer-bottom-link">Privacy Policy</a>
              <a href="#" class="footer-bottom-link">Terms of Service</a>
              <a href="#" class="footer-bottom-link">Returns</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  font-family: system-ui, -apple-system, sans-serif;
}

.footer-main {
  background-color: #f5f5f5;
}

.social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.social-icon:hover {
  opacity: 0.6;
}

.footer-link {
  color: #6c757d;
  text-decoration: none;
  font-size: 13px;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #212529;
}

.btn-teal {
  background-color: #14b8a6;
  border: 1px solid #14b8a6;
  border-left: none;
  color: white;
  border-radius: 0 4px 4px 0 !important;
}

.btn-teal:hover {
  background-color: #0d9488;
  border-color: #0d9488;
}

.input-group .form-control {
  border-radius: 4px 0 0 4px !important;
}

.input-group .form-control:focus {
  border-color: #14b8a6;
  box-shadow: none;
}

.footer-bottom {
  background-color: #1e293b;
}

.footer-bottom-link {
  color: #e2e8f0;
  text-decoration: none;
  font-size: 12px;
  transition: color 0.2s;
}

.footer-bottom-link:hover {
  color: white;
}
</style>