'use client'

import {useState} from "react"
import type { Content, EntireArticle } from "@/lib/types";
import { createArticle } from "@/app/actions/articles";
import Link from "next/link";
import Button from "../../components/ui/Button";
import ArticleEditor from "../../components/ArticleEditor"


export const dynamic = "force-dynamic";

export default function NewArticlePage() {


  return (
  <div className="max-w-4xl mx-auto p-8 bg-stone-200 text-stone-900">
    <Link href="/" className="text-stone-800 hover:text-stone-700 transition-colors text-sm font-medium flex items-center gap-1">
      ⬅️ Zurück
    </Link>
    <hr className="my-4 border-stone-700"/>
    
    <h1 className="text-3xl font-extrabold text-stone-800 mb-6">Neuer Artikel</h1>
    
    <ArticleEditor
          initialTitle=""
          initialContent={{ Article: [] }}
          mode="create"
          
        />
  </div>
);}