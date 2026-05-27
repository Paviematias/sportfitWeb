const productos = [
  {
    id: 1,
    nombre: "Remera DryFit Hombre",
    categoria: "hombre",
    precio: 14990,
    imagen: 'img/dry-fit.jpg',
    descripcion: "Remera liviana y transpirable ideal para entrenamiento."
  },
  {
    id: 2,
    nombre: "Short Running Mujer",
    categoria: "mujer",
    precio: 12990,
    imagen: "img/shortRuningMujer.jpg",
    descripcion: "Short deportivo de secado rápido con cintura elástica."
  },
  {
    id: 3,
    nombre: "Buzo Training Unisex",
    categoria: "hombre",
    precio: 21990,
    imagen: "img/buzoTrainingNike.jpg",
    descripcion: "Buzo térmico ideal para días frescos."
  },
  {
    id: 4,
    nombre: "Calza Deportiva Mujer",
    categoria: "mujer",
    precio: 17990,
    imagen: "img/calzaMujerNike.jpg",
    descripcion: "Calza elastizada con tecnología de compresión leve."
  },
  {
    id: 5,
    nombre: "Gorra Running",
    categoria: "accesorios",
    precio: 8990,
    imagen: "img/gorraNike.jpg  ",
    descripcion: "Gorra ultraliviana con protección UV."
  },
  {
    id: 6,
    nombre: "Mochila Deportiva",
    categoria: "accesorios",
    precio: 15990,
    imagen: "img/mochilaNike.jpg",
    descripcion: "Mochila resistente al agua con compartimentos organizadores."
  }
];

/* Carga dinámica de productos */
const contenedorProductos = document.getElementById("productos-lista");
const tplProducto = document.getElementById("tpl-producto");

function cargarProductos(lista) {
  contenedorProductos.innerHTML = ""; // limpio
  
  lista.forEach(prod => {
    const clon = tplProducto.content.cloneNode(true);

    clon.querySelector(".producto-imagen").src = prod.imagen;
    clon.querySelector(".producto-imagen").alt = prod.nombre;
    clon.querySelector(".producto-nombre").textContent = prod.nombre;
    clon.querySelector(".producto-desc").textContent = prod.descripcion;
    clon.querySelector(".producto-precio").textContent = "$" + prod.precio;

    // Añadimos atributos 
    const tarjeta = clon.querySelector('.producto-card');
    if (tarjeta) {
      tarjeta.setAttribute('data-id', prod.id);
      tarjeta.setAttribute('data-price', prod.precio);
    }

    contenedorProductos.appendChild(clon);
  });
}

// Carga inicial
cargarProductos(productos);

/* Filtro por categoría */
const filtroCategoria = document.getElementById("filter-category");

filtroCategoria.addEventListener("change", () => {
  const categoria = filtroCategoria.value;

  if (categoria === "todos") {
    cargarProductos(productos);
    return;
  }

  const filtrados = productos.filter(p => p.categoria === categoria);
  cargarProductos(filtrados);
});

/* Buscador */
const buscadorProducto = document.getElementById("search-product");

buscadorProducto.addEventListener("input", () => {
  const texto = buscadorProducto.value.toLowerCase();

  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(texto) ||
    p.descripcion.toLowerCase().includes(texto)
  );

  cargarProductos(filtrados);
});

/* Menú móvil */
const btnMenu = document.getElementById("btn-menu");
const listaNavegacion = document.getElementById("nav-list");

btnMenu.addEventListener("click", () => {
  const expandido = btnMenu.getAttribute("aria-expanded") === "true";
  btnMenu.setAttribute("aria-expanded", String(!expandido));
  listaNavegacion.classList.toggle("open");
});

/* Carrusel */
const pistaCarrusel = document.querySelector(".carousel-track");
const btnAnterior = document.querySelector(".carousel-prev");
const btnSiguiente = document.querySelector(".carousel-next");
const diapositivas = document.querySelectorAll(".carousel-item");

let indice = 0;

function actualizarCarrusel() {
  pistaCarrusel.style.transform = `translateX(-${indice * 100}%)`;
}

btnSiguiente.addEventListener("click", () => {
  indice = (indice + 1) % diapositivas.length;
  actualizarCarrusel();
});

btnAnterior.addEventListener("click", () => {
  indice = (indice - 1 + diapositivas.length) % diapositivas.length;
  actualizarCarrusel();
});

// Auto-slide cada 5 segundos
setInterval(() => {
  indice = (indice + 1) % diapositivas.length;
  actualizarCarrusel();
}, 5000);

/* Validación de formulario */
const formulario = document.getElementById("contact-form");
const retroalimentacion = document.getElementById("form-feedback");

function mostrarError(entrada, mensaje) {
  const errorSpan = entrada.parentElement.querySelector(".error");
  errorSpan.textContent = mensaje;
}

function limpiarErrores() {
  document.querySelectorAll(".error").forEach(e => e.textContent = "");
  retroalimentacion.textContent = "";
}

formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  limpiarErrores();

  let valido = true;

  const nombre = formulario.nombre;
  const correo = formulario.email;
  const asunto = formulario.asunto;
  const mensaje = formulario.mensaje;

  // Validaciones
  if (nombre.value.trim().length < 2) {
    mostrarError(nombre, "El nombre debe tener al menos 2 caracteres.");
    valido = false;
  }

  if (!correo.value.includes("@") || !correo.value.includes(".")) {
    mostrarError(correo, "Ingresá un correo electrónico válido.");
    valido = false;
  }

  if (asunto.value.trim().length < 2) {
    mostrarError(asunto, "El asunto es obligatorio.");
    valido = false;
  }

  if (mensaje.value.trim().length < 10) {
    mostrarError(mensaje, "El mensaje debe tener al menos 10 caracteres.");
    valido = false;
  }

  if (!valido) return;

  // Si está todo OK
  retroalimentacion.textContent = "Mensaje enviado con éxito. Nos comunicaremos pronto.";
  retroalimentacion.style.color = "green";

  formulario.reset();
});

/* Carrito */

const alternarCarrito = document.getElementById('cart-toggle');
const contadorCarrito = document.getElementById('cart-count');
const panelCarrito = document.getElementById('carrito');
const superposicionCarrito = document.getElementById('cart-overlay');
const cerrarCarrito = document.getElementById('cart-close');
const elementosCarrito = document.getElementById('cart-items');
const tplElementoCarrito = document.getElementById('tpl-cart-item');
const totalCarrito = document.getElementById('cart-total');
const vaciarCarrito = document.getElementById('cart-clear');
const pagarCarrito = document.getElementById('cart-checkout');


let carrito = [];

function formatearMoneda(valor) {
  return '$' + valor;
}

function actualizarContadorCarrito() {
  var cantidadTotal = 0;
  for (var i = 0; i < carrito.length; i++) {
    cantidadTotal += carrito[i].cantidad;
  }
  if (contadorCarrito) {
    contadorCarrito.textContent = cantidadTotal;
  }
}

function calcularTotal() {
  return carrito.reduce((s, it) => s + (it.precio * it.cantidad), 0);
}

function mostrarCarrito() {
  elementosCarrito.innerHTML = '';

  if (carrito.length === 0) {
    elementosCarrito.innerHTML = '<li class="cart-empty">No hay productos en el carrito.</li>';
    totalCarrito.textContent = formatearMoneda(0);
    actualizarContadorCarrito();
    return;
  }

  carrito.forEach(item => {
    const nodo = tplElementoCarrito.content.cloneNode(true);
    const li = nodo.querySelector('.cart-item');
    const img = nodo.querySelector('.cart-item-img');
    const titulo = nodo.querySelector('.cart-item-title');
    const precioEl = nodo.querySelector('.cart-item-price');
    const cantidadInput = nodo.querySelector('.cart-item-qty');
    const btnEliminar = nodo.querySelector('.cart-item-remove');

    li.setAttribute('data-id', item.id);
    img.src = item.imagen;
    img.alt = item.nombre;
    titulo.textContent = item.nombre;
    precioEl.textContent = formatearMoneda(item.precio);
    cantidadInput.value = item.cantidad;

    cantidadInput.addEventListener('change', (e) => {
      const v = parseInt(e.target.value, 10) || 1;
      cambiarCantidad(item.id, v);
    });

    btnEliminar.addEventListener('click', () => {
      eliminarDelCarrito(item.id);
    });

    elementosCarrito.appendChild(nodo);
  });

  totalCarrito.textContent = formatearMoneda(calcularTotal());
  actualizarContadorCarrito();
}

function agregarAlCarrito(producto) {
  const existente = carrito.find(p => p.id === producto.id);
  if (existente) {
    existente.cantidad += 1;
  } else {
    var nuevo = {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: 1
    };
    carrito.push(nuevo);
  }
  mostrarCarrito();
  abrirCarrito();
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter(i => i.id !== Number(id));
  mostrarCarrito();
}

function cambiarCantidad(id, cantidad) {
  const it = carrito.find(i => i.id === Number(id));
  if (!it) return;
  it.cantidad = Math.max(1, Number(cantidad));
  mostrarCarrito();
}

function limpiarCarrito() {
  carrito = [];
  mostrarCarrito();
}

function abrirCarrito() {
  panelCarrito.setAttribute('aria-hidden', 'false');
  panelCarrito.classList.add('open');
  if (superposicionCarrito) superposicionCarrito.removeAttribute('hidden');
}

function cerrarPanelCarrito() {
  panelCarrito.setAttribute('aria-hidden', 'true');
  panelCarrito.classList.remove('open');
  if (superposicionCarrito) superposicionCarrito.setAttribute('hidden', '');
}

// Eventos: abrir/cerrar
alternarCarrito && alternarCarrito.addEventListener('click', () => {
  const abierto = panelCarrito.classList.contains('open');
  if (abierto) cerrarPanelCarrito(); else abrirCarrito();
});

cerrarCarrito && cerrarCarrito.addEventListener('click', cerrarPanelCarrito);
superposicionCarrito && superposicionCarrito.addEventListener('click', cerrarPanelCarrito);
vaciarCarrito && vaciarCarrito.addEventListener('click', limpiarCarrito);
pagarCarrito && pagarCarrito.addEventListener('click', function() {
  // Vaciar carrito y mostrar mensaje
  limpiarCarrito();
  elementosCarrito.innerHTML = '<li class="cart-success">Gracias por tu compra.</li>';
  totalCarrito.textContent = formatearMoneda(0);
  actualizarContadorCarrito();
});

// botón "Añadir" en tarjetas de producto
document.addEventListener('click', function(e) {
  // buscar botón ascendiendo 
  var nodo = e.target;
  var btn = null;
  while (nodo) {
    if (nodo.classList && nodo.classList.contains('btn-agregar')) { btn = nodo; break; }
    nodo = nodo.parentElement;
  }
  if (!btn) return;

  // buscar la tarjeta producto ascendiendo
  nodo = btn;
  var tarjeta = null;
  while (nodo) {
    if (nodo.classList && nodo.classList.contains('producto-card')) { tarjeta = nodo; break; }
    nodo = nodo.parentElement;
  }
  if (!tarjeta) return;

  var idAttr = tarjeta.getAttribute('data-id');
  var priceAttr = tarjeta.getAttribute('data-price');
  var id = parseInt(idAttr, 10) || 0;
  var precio = parseInt(priceAttr, 10) || 0;

  var nombreEl = tarjeta.querySelector('.producto-nombre');
  var imagenEl = tarjeta.querySelector('.producto-imagen');
  var nombre = 'Producto';
  var imagen = '';
  if (nombreEl) nombre = nombreEl.textContent;
  if (imagenEl) imagen = imagenEl.src;

  agregarAlCarrito({ id: id, nombre: nombre, precio: precio, imagen: imagen });
});



// Inicialización
carrito = [];
mostrarCarrito();

