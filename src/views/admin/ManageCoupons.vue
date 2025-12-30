<template>
  <div class="rewards-container">
    <div class="rewards-card">
      <!-- Header -->
      <div class="rewards-header">
        <h2 class="rewards-title">Rewards</h2>
        <button class="btn-add-new">Add New</button>
      </div>

      <!-- Coupons Grid -->
      <div class="coupons-grid">
        <!-- Coupon 1 -->
        <div class="coupon-card">
          <div class="coupon-content">
            <div class="coupon-number-section">
              <div class="coupon-number">1</div>
              <div class="coupon-label">No.</div>
            </div>
            <div class="divider"></div>
            <div class="coupon-text">
              <div>HAPPYNEWYEAR</div>
              <div class="discount-text">Discount 15%</div>
            </div>
            <div class="coupon-actions">
              <button class="btn-edit">Edit</button>
              <button class="btn-delete">Delete</button>
            </div>
          </div>
        </div>

        <!-- Coupon 2 -->
        <div class="coupon-card">
          <div class="coupon-content">
            <div class="coupon-number-section">
              <div class="coupon-number">2</div>
              <div class="coupon-label">No.</div>
            </div>
            <div class="divider"></div>
            <div class="coupon-text">
              <div>MERRYCHRISTMAS</div>
              <div class="discount-text">Discount 15%</div>
            </div>
            <div class="coupon-actions">
              <button class="btn-edit">Edit</button>
              <button class="btn-delete">Delete</button>
            </div>
          </div>
        </div>

        <!-- Coupon 3 -->
        <div class="coupon-card">
          <div class="coupon-content">
            <div class="coupon-number-section">
              <div class="coupon-number">3</div>
              <div class="coupon-label">No.</div>
            </div>
            <div class="divider"></div>
            <div class="coupon-text">
              <div>SAVE40</div>
              <div class="discount-text">Discount 40%</div>
            </div>
            <div class="coupon-actions">
              <button class="btn-edit">Edit</button>
              <button class="btn-delete">Delete</button>
            </div>
          </div>
        </div>

        <!-- Coupon 4 -->
        <div class="coupon-card">
          <div class="coupon-content">
            <div class="coupon-number-section">
              <div class="coupon-number">4</div>
              <div class="coupon-label">No.</div>
            </div>
            <div class="divider"></div>
            <div class="coupon-text">
              <div>WELCOME10</div>
              <div class="discount-text">Discount 10%</div>
            </div>
            <div class="coupon-actions">
              <button class="btn-edit">Edit</button>
              <button class="btn-delete">Delete</button>
            </div>
          </div>
        </div>

        <!-- Coupon 5 -->
        <div class="coupon-card">
          <div class="coupon-content">
            <div class="coupon-number-section">
              <div class="coupon-number">5</div>
              <div class="coupon-label">No.</div>
            </div>
            <div class="divider"></div>
            <div class="coupon-text">
              <div>STUDENT10</div>
              <div class="discount-text">Discount 10%</div>
            </div>
            <div class="coupon-actions">
              <button class="btn-edit">Edit</button>
              <button class="btn-delete">Delete</button>
            </div>
          </div>
        </div>

        <!-- Coupon 6 -->
        <div class="coupon-card">
          <div class="coupon-content">
            <div class="coupon-number-section">
              <div class="coupon-number">6</div>
              <div class="coupon-label">No.</div>
            </div>
            <div class="divider"></div>
            <div class="coupon-text">
              <div>CLEARANCE25</div>
              <div class="discount-text">Discount 30%</div>
            </div>
            <div class="coupon-actions">
              <button class="btn-edit">Edit</button>
              <button class="btn-delete">Delete</button>
            </div>
          </div>
        </div>

        <!-- Coupon 7 -->
        <div class="coupon-card">
          <div class="coupon-content">
            <div class="coupon-number-section">
              <div class="coupon-number">7</div>
              <div class="coupon-label">No.</div>
            </div>
            <div class="divider"></div>
            <div class="coupon-text">
              <div>HALLOWEEN</div>
              <div class="discount-text">Discount 5%</div>
            </div>
            <div class="coupon-actions">
              <button class="btn-edit">Edit</button>
              <button class="btn-delete">Delete</button>
            </div>
          </div>
        </div>

        <!-- Coupon 8 -->
        <div class="coupon-card">
          <div class="coupon-content">
            <div class="coupon-number-section">
              <div class="coupon-number">8</div>
              <div class="coupon-label">No.</div>
            </div>
            <div class="divider"></div>
            <div class="coupon-text">
              <div>ANNIVERSARY10</div>
              <div class="discount-text">Discount 50%</div>
            </div>
            <div class="coupon-actions">
              <button class="btn-edit">Edit</button>
              <button class="btn-delete">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.rewards-container {
  background: #f2f2f2;
  padding: 20px;
  min-height: calc(100vh - 65px);
}

.rewards-card {
  background: #fff;
  border-radius: 5px;
  padding: 10px 0;
}

.rewards-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 25px;
  border-bottom: 1px solid #f2f2f2;
  padding-bottom: 14px;
  margin-bottom: 25px;
}

.rewards-title {
  color: #1c1a1a;
  font-family: 'Source Sans Pro', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.btn-add-new {
  width: 90px;
  height: 34px;
  border-radius: 5px;
  background: #ff4f5a;
  border: none;
  color: #fff;
  font-family: 'Source Sans Pro', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 13px;
  font-weight: 700;
  line-height: 22px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-add-new:hover {
  background: #e63946;
}

.coupons-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 19px;
  padding: 0 25px;
}

.coupon-card {
  border-radius: 5px;
  border: 1px solid #d3d3d3;
  background: #fff;
  box-shadow: 0 0 30px 3px rgba(0, 0, 0, 0.03);
  height: 70px;
}

.coupon-content {
  display: flex;
  align-items: center;
  padding: 1px 27px;
  height: 100%;
  position: relative;
}

.coupon-number-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 18px;
  margin-right: 26px;
}

.coupon-number {
  font-family: 'Source Sans Pro', -apple-system, Roboto, Helvetica, sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: #ff4f5a;
  line-height: 1;
}

.coupon-label {
  font-family: 'Source Sans Pro', -apple-system, Roboto, Helvetica, sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: #9b9b9b;
  margin-top: 2px;
}

.divider {
  width: 1px;
  height: 68px;
  background: #ebebeb;
  margin-right: 21px;
}

.coupon-text {
  flex: 1;
  color: #454545;
  font-family: 'Source Sans Pro', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 13px;
  line-height: 17px;
}

.discount-text {
  font-weight: 600;
}

.coupon-actions {
  display: flex;
  gap: 15px;
}

.btn-edit,
.btn-delete {
  height: 28px;
  border-radius: 3px;
  border: 1px solid #ff4f5a;
  background: #fff;
  color: #ff4f5a;
  font-family: 'Source Sans Pro', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 22px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit {
  width: 50px;
  padding: 3px 15px;
}

.btn-delete {
  width: 64px;
  padding: 3px 15px;
}

.btn-edit:hover,
.btn-delete:hover {
  background: #ff4f5a;
  color: #fff;
}

/* Responsive design */
@media (max-width: 1200px) {
  .coupons-grid {
    gap: 15px;
  }
}

@media (max-width: 768px) {
  .coupons-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .rewards-container {
    padding: 15px;
  }

  .rewards-header {
    padding: 4px 15px;
  }

  .coupons-grid {
    padding: 0 15px;
  }
}

@media (max-width: 576px) {
  .coupon-content {
    padding: 1px 15px;
  }

  .coupon-number-section {
    margin-right: 15px;
  }

  .divider {
    margin-right: 15px;
  }

  .coupon-actions {
    gap: 10px;
  }

  .btn-edit,
  .btn-delete {
    font-size: 11px;
    padding: 3px 10px;
  }

  .btn-edit {
    width: 45px;
  }

  .btn-delete {
    width: 58px;
  }
}
</style>
