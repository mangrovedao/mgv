import { describe, expect, it } from 'vitest'
import type { RpcOffer, RpcOfferDetail } from '~mgv/types/lib.js'
import { unpackOfferDetail } from './offer-detail.js'
import { unpackOffer } from './offer.js'

describe('offer unpacking', () => {
  it('should unpack correctly (positive tick)', () => {
    const offersPacked = [
      20074413445151042300888515900011094147352441356857739357192192n,
      233176578729722529410070503139477613292134408309508641520409614535884800n,
      86217909441547988158729551466430440218870285623316557371504824470732800n,
      242098377592571395350501067420406645365749373548850315264n,
      242101370747924649039677553083167169512548075655990870016n,
      1883372645931994979829289916352454467617802820818793006104576n,
      8061024053478283423921428261697422660808259975697089712700305113612288n,
      242128309146103932242265891043406711097747838886159056896n,
      5555477173105824639687983434852379924900441298287078150242304n,
      232502580111804289737591738881330183235764209919372460636771354578780160n,
    ]

    const offerDetailsPacked = [
      111385484405210276107289276202447911509002252844886096948391386415478668787712n,
      4780814098276331714868267828587138455905308604891585173474459358903805149184n,
      13830159667752811102904304868098135171819172012209413287347388936632043307008n,
      4780814098276331714868267828587138455905308604891585173474459358903805149184n,
      13830159667752811102904304868098135171819172012209413287347388936632043307008n,
      70625411196971881888116396860640998045505933307714713849814216570844890529792n,
      70625411196971881888116396860640998045505933307714713849814216570844890529792n,
      13830159667752811102904304868098135171819172012209413287347388936632043307008n,
      97109061083874892979275674078046484534971449924704862943973387262918628737024n,
      13830159667752811102904304868098135171819172012209413287347388936632043307008n,
    ]

    const rpcOffers: RpcOffer[] = [
      {
        prev: 0n,
        next: 3198n,
        tick: 80883n,
        gives: 1000000000000000000n,
      },
      {
        prev: 8649n,
        next: 882n,
        tick: 80883n,
        gives: 125036043542649160n,
      },
      {
        prev: 3198n,
        next: 0n,
        tick: 80883n,
        gives: 188322099979469128n,
      },
      {
        prev: 0n,
        next: 0n,
        tick: 80884n,
        gives: 618974049173486927n,
      },
      {
        prev: 0n,
        next: 0n,
        tick: 80885n,
        gives: 875691611720677321n,
      },
      {
        prev: 0n,
        next: 300n,
        tick: 80893n,
        gives: 187833742582330357n,
      },
      {
        prev: 299n,
        next: 0n,
        tick: 80893n,
        gives: 221897193756015715n,
      },
      {
        prev: 0n,
        next: 0n,
        tick: 80894n,
        gives: 1310055078305437949n,
      },
      {
        prev: 0n,
        next: 885n,
        tick: 80897n,
        gives: 122717005746002593n,
      },
      {
        prev: 8624n,
        next: 8650n,
        tick: 80897n,
        gives: 14763692993439552770n,
      },
    ]

    const rpcOfferDetails: RpcOfferDetail[] = [
      {
        maker: '0xF641F33687F21d47CDac08D65021ea77A85B2ADD',
        gasreq: 800000n,
        kilo_offer_gasbase: 300n,
        gasprice: 5n,
      },
      {
        maker: '0x0A91d84A961103011B97ED29dc56BD943505EeD0',
        gasreq: 1000000n,
        kilo_offer_gasbase: 300n,
        gasprice: 5n,
      },
      {
        maker: '0x1e9397Cd0BD25781857eEe205719631BC5AaFFFe',
        gasreq: 1500000n,
        kilo_offer_gasbase: 300n,
        gasprice: 5n,
      },
      {
        maker: '0x0A91d84A961103011B97ED29dc56BD943505EeD0',
        gasreq: 1000000n,
        kilo_offer_gasbase: 300n,
        gasprice: 5n,
      },
      {
        maker: '0x1e9397Cd0BD25781857eEe205719631BC5AaFFFe',
        gasreq: 1500000n,
        kilo_offer_gasbase: 300n,
        gasprice: 5n,
      },
      {
        maker: '0x9c2490F010fd386dF45DB793a4900e7a6e4059DA',
        gasreq: 1500000n,
        kilo_offer_gasbase: 300n,
        gasprice: 5n,
      },
      {
        maker: '0x9c2490F010fd386dF45DB793a4900e7a6e4059DA',
        gasreq: 1500000n,
        kilo_offer_gasbase: 300n,
        gasprice: 5n,
      },
      {
        maker: '0x1e9397Cd0BD25781857eEe205719631BC5AaFFFe',
        gasreq: 1500000n,
        kilo_offer_gasbase: 300n,
        gasprice: 5n,
      },
      {
        maker: '0xd6B1C7E2990F7e003272Bd5A0f3a1F13478b0D3c',
        gasreq: 800000n,
        kilo_offer_gasbase: 300n,
        gasprice: 5n,
      },
      {
        maker: '0x1e9397Cd0BD25781857eEe205719631BC5AaFFFe',
        gasreq: 1500000n,
        kilo_offer_gasbase: 300n,
        gasprice: 5n,
      },
    ]

    const resolvedOffers: RpcOffer[] = offersPacked.map((offer) =>
      unpackOffer(offer),
    )
    const resolvedOfferDetails: RpcOfferDetail[] = offerDetailsPacked.map(
      (offerDetail) => unpackOfferDetail(offerDetail),
    )

    expect(resolvedOffers).toEqual(rpcOffers)
    expect(resolvedOfferDetails).toEqual(rpcOfferDetails)
  })

  it('should unpack correctly (negative tick)', () => {
    const offersPacked = [
      6037607402951440078068834159367999131039187881724974465024n,
      6037610396106793331758010605330164445154812137074822479872n,
      6037637334504972614960598542085547985349238119548191768576n,
      6037643320815679122338960834772586440906678945923150643200n,
      6037646313971032376028140869540704815886303201272998658048n,
      290196450876233378097758262348194902868415046125028938377854976n,
      501320208275672184631140271928759749678999361822713279965701379033399296n,
      6037661279747798644474008873479899466573577449747358154752n,
      85437392285878783700956946440343577085766537272144231655276544n,
      501347168245457900980323016316576116850136692486404924633552497240178688n,
    ]

    const rpcOffers: RpcOffer[] = [
      { prev: 0n, next: 0n, tick: -80014n, gives: 409000000000000000000n },
      { prev: 0n, next: 0n, tick: -80013n, gives: 407000000000000000000n },
      { prev: 0n, next: 0n, tick: -80004n, gives: 384628507787907540642n },
      { prev: 0n, next: 0n, tick: -80002n, gives: 915000000000000000000n },
      { prev: 0n, next: 0n, tick: -80001n, gives: 1117000000000000000000n },
      { prev: 0n, next: 46230n, tick: -80000n, gives: 887000000000000000000n },
      { prev: 18595n, next: 0n, tick: -80000n, gives: 285151932926349488305n },
      { prev: 0n, next: 0n, tick: -79996n, gives: 298352820166691182804n },
      { prev: 0n, next: 13610n, tick: -79994n, gives: 1927000000000000000000n },
      {
        prev: 18596n,
        next: 3683n,
        tick: -79994n,
        gives: 2326000000000000000000n,
      },
    ]

    const resolvedOffers: RpcOffer[] = offersPacked.map((offer) =>
      unpackOffer(offer),
    )

    expect(resolvedOffers).toEqual(rpcOffers)
  })
})
