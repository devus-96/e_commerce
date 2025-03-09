import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Récupérer les informations d'authentification avec getAuth
    const { userId, getToken } = getAuth(req);

    // Vérifier si l'utilisateur est authentifié
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Récupérer le token d'authentification
    const token = await getToken();

    // Retourner le token dans la réponse
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error in API route:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}