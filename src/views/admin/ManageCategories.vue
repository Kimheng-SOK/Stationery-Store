<template>
  <div class="categories-page">
    <div class="categories-container">
      <div class="categories-header">
        <h2 class="categories-title">Categories</h2>
        <button class="btn btn-add-new">Add New</button>
      </div>
      <div class="categories-divider"></div>

      <!-- Category Cards -->
      <div class="categories-list">
        <!-- Book Category -->
        <div class="category-card">
          <div class="category-image-wrapper">
            <img
              src="/public/images/notebooks/book4.jpg"
              alt="Notebook"
              class="category-image"
            />
          </div>
          <div class="category-content">
            <h3 class="category-name">NoteBooks</h3>
            <div class="category-subcategories">
              <p class="sub-label">Tags</p>
              <div class="sub-tags">
                <span class="sub-tag">Premium Leather Journal</span>
                <span class="sub-tag">Notebook Set - Premium</span>
                <span class="sub-tag">School Notebooks</span>
                <span class="sub-tag">College Notebooks</span>
                <span class="sub-tag">Office Notebooks</span>
                <span class="sub-tag">Exam Notebooks</span>
                <span class="sub-tag">Drawing Notebook</span>
                <span class="sub-tag">Executive Notebook Set</span>
              </div>
            </div>
          </div>
          <div class="category-actions">
            <button class="btn btn-edit">Edit</button>
            <button class="btn btn-delete">Delete</button>
          </div>
        </div>

        <!-- Pens & Pencils Category -->
        <div class="category-card">
          <div class="category-image-wrapper">
            <img
              src="/public/images/pens&pencils/pen2.jpg"
              alt="Pens & Pencils"
              class="category-image"
            />
          </div>
          <div class="category-content">
            <h3 class="category-name">Pens & Pencils</h3>
            <div class="category-subcategories">
              <p class="sub-label">Tags</p>
              <div class="sub-tags">
                <span class="sub-tag">Premium Pen Collection</span>
                <span class="sub-tag">Professional Pen Set 2024</span>
                <span class="sub-tag">Marker Set - Vibrant</span>
                <span class="sub-tag">Highlighter Set - Pastel</span>
                <span class="sub-tag">Health & Personal Care</span>
                <span class="sub-tag">Gel Pens Set - All Colors</span>
              </div>
            </div>
          </div>
          <div class="category-actions">
            <button class="btn btn-edit">Edit</button>
            <button class="btn btn-delete">Delete</button>
          </div>
        </div>

        <!-- Office supplies Category -->
        <div class="category-card">
          <div class="category-image-wrapper">
            <img
              src="/public/images/officeSupplies/office1.jpg"
              alt="officesupplies"
              class="category-image"
            />
          </div>
          <div class="category-content">
            <h3 class="category-name">Office Supplies</h3>
            <div class="category-subcategories">
              <p class="sub-label">Tags</p>
              <div class="sub-tags">
                <span class="sub-tag">Desk Lamp Modern</span>
                <span class="sub-tag">Bamboo Desk Organizer</span>
                <span class="sub-tag">Desk Calendar 2025</span>
              </div>
            </div>
          </div>
          <div class="category-actions">
            <button class="btn btn-edit">Edit</button>
            <button class="btn btn-delete">Delete</button>
          </div>
        </div>

        <!-- Art Supplies Category -->
        <div class="category-card">
          <div class="category-image-wrapper">
            <img
              src="/public/images/artSupplies/art1.jpg"
              alt="Beauty"
              class="category-image"
            />
          </div>
          <div class="category-content">
            <h3 class="category-name">Art Supplies</h3>
            <div class="category-subcategories">
              <p class="sub-label">Tags</p>
              <div class="sub-tags">
                <span class="sub-tag">Watercolor Paint Set</span>
                <span class="sub-tag">Acrylic Paint Set</span>
                <span class="sub-tag">Sketching Pencil Set</span>
                <span class="sub-tag">Brush Set for Artists</span>
              </div>
            </div>
          </div>
          <div class="category-actions">
            <button class="btn btn-edit">Edit</button>
            <button class="btn btn-delete">Delete</button>
          </div>
        </div>

        <!-- Sticky Note Category -->
        <div class="category-card">
          <div class="category-image-wrapper">
            <img
              src="/public/images/stickyNote/stick1.jpg"
              alt="stickynote"
              class="category-image"
            />
          </div>
          <div class="category-content">
            <h3 class="category-name">stickynote</h3>
            <div class="category-subcategories">
              <p class="sub-label">Tags</p>
              <div class="sub-tags">
                <span class="sub-tag">Colorful Sticky Notes Set</span>
                <span class="sub-tag">Pastel Sticky Notes Set</span>
                <span class="sub-tag">Neon Sticky Notes Pack</span>
                <span class="sub-tag">Transparent Sticky Notes</span>
                <span class="sub-tag">Page Marker Sticky Notes</span>
                <span class="sub-tag">Mini Sticky Notes</span>
              </div>
            </div>
          </div>
          <div class="category-actions">
            <button class="btn btn-edit">Edit</button>
            <button class="btn btn-delete">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.categories-page {
  margin-left: 0px;
  margin-top: 0px;
  background: #f2f2f2;
  min-height: calc(100vh - 65px);
  padding: 20px 30px;
}

.categories-container {
  background: #fff;
  border-radius: 5px;
  padding: 0;
}

.categories-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 25px;
  position: relative;
}

.categories-title {
  color: #1c1a1a;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.btn-add-new {
  background: #ff4f5a;
  border: none;
  border-radius: 5px;
  color: #fff;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 13px;
  font-weight: 700;
  line-height: 22px;
  padding: 6px 20px;
  height: 34px;
}

.btn-add-new:hover {
  background: #ff3945;
}

.categories-divider {
  width: 100%;
  height: 1px;
  background: #f2f2f2;
}

.categories-list {
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.category-card {
  display: flex;
  align-items: flex-start;
  gap: 19px;
  padding: 26px;
  border-radius: 5px;
  border: 1px solid #d3d3d3;
  background: #fff;
  box-shadow: 0 0 30px 3px rgba(0, 0, 0, 0.03);
  position: relative;
}

.category-image-wrapper {
  width: 150px;
  height: 150px;
  border-radius: 5px;
  border: 1px dashed #d3d3d3;
  background: #fff;

  position: relative;
  overflow: hidden;
  padding: 0;
  flex-shrink: 0;
}

.category-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.category-content {
  flex: 1;
  min-width: 0;
}

.category-name {
  color: #1c1a1a;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 15px 0;
  padding-top: 5px;
}

.category-subcategories {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sub-label {
  color: #9b9b9b;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 12px;
  font-weight: 400;
  margin: 0;
}

.sub-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: flex-start;
}

.sub-tag {
  display: inline-flex;
  padding: 2px 9px;
  align-items: center;
  border-radius: 4px;
  background: #f5f5f5;
  color: #454545;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 24px;
  white-space: nowrap;
}

.category-actions {
  display: flex;
  gap: 15px;
  flex-shrink: 0;
  padding-top: 1px;
}

.btn-edit,
.btn-delete {
  border-radius: 3px;
  border: 1px solid #ff4f5a;
  background: #fff;
  color: #ff4f5a;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 22px;
  padding: 3px 15px;
  height: 28px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit:hover,
.btn-delete:hover {
  background: #ff4f5a;
  color: #fff;
}
</style>
