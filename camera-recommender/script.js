document.getElementById("cameraForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const userPrefs = {
    budget: parseInt(formData.get("budget")),
    used: formData.get("used") === "on",
    purpose: formData.get("purpose").toLowerCase(),
    environment: formData.get("environment").toLowerCase(),
    expectations: formData.get("expectations").toLowerCase(),
    raw: formData.get("raw") === "on",
    lens: formData.get("lens"),
    size: formData.get("size").toLowerCase(),
    interchangeable: formData.get("interchangeable"),
  };

  const res = await fetch("./db/cameras.json");
  const cameraDB = await res.json();

  const recommended = cameraDB.filter(cam => {
    return cam.price <= userPrefs.budget &&
           (userPrefs.used || cam.status === "new") &&
           (userPrefs.raw ? cam.raw : true) &&
           (userPrefs.interchangeable === "모름" || cam.type === userPrefs.interchangeable) &&
           (userPrefs.lens === "모름" || cam.lens_type === userPrefs.lens);
  });

  displayResults(recommended);
});

function displayResults(results) {
  const container = document.getElementById("result");
  container.innerHTML = "<h2>추천 결과:</h2>";

  if (results.length === 0) {
    container.innerHTML += "<p>조건에 맞는 카메라가 없습니다 😥</p>";
    return;
  }

  results.forEach(cam => {
    const card = `
      <div class="card">
        <h3>${cam.name}</h3>
        <p>가격: ₩${cam.price.toLocaleString()}</p>
        <p>렌즈 타입: ${cam.lens_type}</p>
        <p>RAW 지원: ${cam.raw ? "O" : "X"}</p>
        <p>종류: ${cam.type}</p>
      </div>
    `;
    container.innerHTML += card;
  });
}
