import { CategorieStock } from '@prisma/client'
import { listerStocks, obtenirAlertesStock, receptionnerMarchandise, declarerPerte, obtenirCatalogue } from '../repositories/stock.repository'
import { PaginationParams } from '../types'

export async function obtenirStocks(params: PaginationParams & { agenceId?: number; fruitId?: number; categorie?: CategorieStock }) {
  return listerStocks(params)
}
export async function obtenirAlertes(agenceId?: number) {
  return obtenirAlertesStock(agenceId)
}
export async function recevoirMarchandise(data: any) {
  return receptionnerMarchandise(data)
}
export async function declarerUnePerte(data: any) {
  return declarerPerte(data)
}
export async function obtenirCatalogueAgence(agenceId: number) {
  return obtenirCatalogue(agenceId)
}
