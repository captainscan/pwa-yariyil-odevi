function qs(name) {
    const u = new URL(location.href);
    return u.searchParams.get(name);
}

function showAlert(type, msg) {
    document.getElementById("formAlert").innerHTML =
        `<div class="alert alert-${type}">${msg}</div>`;
}

document.addEventListener("DOMContentLoaded", () => {
    const breed = qs("breed");
    if (breed) document.querySelector('[name="breed"]').value = breed;

    const form = document.getElementById("adoptionForm");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            showAlert("danger", "Lütfen hatalı alanları düzeltin.");
            return;
        }

        form.classList.remove("was-validated");
        showAlert("success", "Başarılı! Başvurunuz alındı. Yetkililerimiz 24-48 saat içinde size dönüş yapacaktır.");
        form.reset();
    });
});
