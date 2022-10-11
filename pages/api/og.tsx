// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Resvg } from '@resvg/resvg-js'
import { readFile } from 'fs/promises'
import type { NextApiRequest, NextApiResponse } from 'next'
import { resolve } from 'path'
import satori from 'satori'
import { pipeline, Readable } from 'stream'
import { promisify } from 'util'

type Data = {
  name: string
}

const pipe = promisify(pipeline)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const fontBuffer = await readFile(resolve('./public', 'roboto.ttf'))

  const svg = await satori(
    (<div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        fontSize: 32,
        fontWeight: 600,
        fontFamily: 'roboto',
      }}
    >
      <img
        src="https://pbs.twimg.com/profile_images/1390841346504552456/qmZBIgoW_400x400.jpg"
        alt="moga profile"
        width="200"
        style={{ margin: '0 75px' }}
      />
      <div style={{ marginTop: 40 }}>Hello, moga</div>
    </div>),
    { width: 1200, height: 630, fonts: [{ data: fontBuffer, 'name': 'roboto' }] }
  )

  const resvg = new Resvg(svg)
  const pngData = resvg.render()
  const pngBuffer = pngData.asPng()

  res.setHeader('Content-Type', 'image/png')
  await pipe(Readable.from(pngBuffer), res)
}
