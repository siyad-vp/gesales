// Copyright (c) 2026, Tridz and contributors
// For license information, please see license.txt

const CHARGE_FIELDS = [
	"customs_vat",
	"custom_duty",
	"border_charge",
	"translation_charge",
	"clearing_charge",
	"documentation_charge",
	"collection_charge",
	"other_charge",
];

function calculate_totals(frm) {
	let total_qty = 0;
	let gross_total = 0;

	(frm.doc.items || []).forEach((row) => {
		row.amount = flt(row.qty) * flt(row.rate);
		total_qty += flt(row.qty);
		gross_total += flt(row.amount);
	});

	let total_charges = 0;
	CHARGE_FIELDS.forEach((f) => {
		total_charges += flt(frm.doc[f]);
	});

	let vat_amount = (gross_total + total_charges) * flt(frm.doc.vat_rate) / 100;

	frm.set_value("total_qty", total_qty);
	frm.set_value("gross_total", gross_total);
	frm.set_value("total_charges", total_charges);
	frm.set_value("vat_amount", vat_amount);
	frm.set_value("net_total", gross_total + total_charges + vat_amount);

	frm.refresh_field("items");
}

frappe.ui.form.on("Import Invoice", {
	refresh: function (frm) {
		calculate_totals(frm);
	},
	vat_rate: function (frm) {
		calculate_totals(frm);
	},
	validate: function (frm) {
		calculate_totals(frm);
	},
});

CHARGE_FIELDS.forEach((f) => {
	frappe.ui.form.on("Import Invoice", f, function (frm) {
		calculate_totals(frm);
	});
});

frappe.ui.form.on("Import Invoice Item", {
	qty: function (frm) {
		calculate_totals(frm);
	},
	rate: function (frm) {
		calculate_totals(frm);
	},
	items_remove: function (frm) {
		calculate_totals(frm);
	},
});

