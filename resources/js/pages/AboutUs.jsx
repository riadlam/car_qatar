import SiteLayout from '../components/landing/SiteLayout';
import { IMG } from '../components/landing/motion';

const VALUES = [
    {
        title: 'Reliable chauffeurs',
        body: 'Professionally trained drivers dedicated to punctual, discreet, and courteous service.',
    },
    {
        title: 'Premium fleet',
        body: 'A curated selection of recent, well-maintained vehicles for every occasion.',
    },
    {
        title: 'Seamless journeys',
        body: 'From airport transfers to multi-stop itineraries, we tailor every ride to you.',
    },
];

export default function AboutUs() {
    return (
        <SiteLayout>
            <div id="top" className="bg-page pt-[72px] lg:pt-[88px]">
                <section className="mx-auto grid w-full max-w-[1170px] items-center gap-10 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)] lg:px-12 lg:py-20">
                    <div>
                        <p className="font-geist m-0 text-[14px] leading-5 font-500 tracking-[0.15px] text-wine-700 uppercase">
                            About us
                        </p>
                        <h1 className="font-fragment mt-4 mb-0 text-[38px] leading-[46px] font-400 tracking-[0.25px] text-ink-text sm:text-[48px] sm:leading-[56px] lg:text-[56px] lg:leading-[64px]">
                            Premium chauffeur travel, thoughtfully delivered
                        </h1>
                        <p className="font-geist mt-6 mb-0 max-w-[620px] text-[17px] leading-7 text-ink-text/75">
                            AL MAJD provides private chauffeur services designed for comfort,
                            reliability, and a calm travel experience — across Qatar and beyond.
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-2xl">
                        <img
                            src={IMG.ride1}
                            alt="AL MAJD chauffeur welcoming a passenger"
                            className="h-[320px] w-full object-cover sm:h-[420px]"
                        />
                    </div>
                </section>
            </div>

            <section className="bg-white px-6 py-16 lg:px-12 lg:py-20">
                <div className="mx-auto max-w-[720px]">
                    <h2 className="font-fragment m-0 text-[32px] leading-10 font-400 tracking-[0.25px] text-ink-text lg:text-[40px] lg:leading-[48px]">
                        Our story
                    </h2>
                    <p className="font-geist mt-5 mb-0 text-[16px] leading-7 text-ink-text/75">
                        Content for this section will be added later. For now, AL MAJD stands for
                        elevated private travel — combining professional chauffeurs, carefully
                        selected vehicles, and attentive service that starts before you step into
                        the car and continues until your journey is complete.
                    </p>
                    <p className="font-geist mt-4 mb-0 text-[16px] leading-7 text-ink-text/75">
                        Whether you are booking a one-way transfer, a city tour, or recurring
                        school journeys, our focus is the same: arrive on time, travel in comfort,
                        and leave ready for what comes next.
                    </p>
                </div>
            </section>

            <section className="bg-page px-6 py-16 lg:px-12 lg:py-20">
                <div className="mx-auto max-w-[1170px]">
                    <h2 className="font-fragment m-0 max-w-[640px] text-[32px] leading-10 font-400 tracking-[0.25px] text-ink-text lg:text-[40px] lg:leading-[48px]">
                        What we stand for
                    </h2>
                    <div className="mt-10 grid gap-4 md:grid-cols-3">
                        {VALUES.map((item) => (
                            <div
                                key={item.title}
                                className="rounded-2xl border border-[#e8e8ea] bg-white p-6"
                            >
                                <h3 className="font-geist m-0 text-[18px] leading-7 font-500 text-ink-text">
                                    {item.title}
                                </h3>
                                <p className="font-geist mt-3 mb-0 text-[15px] leading-6 text-ink-text/70">
                                    {item.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white px-6 py-16 text-center lg:px-12 lg:py-20">
                <div className="mx-auto max-w-[640px]">
                    <h2 className="font-fragment m-0 text-[32px] leading-10 font-400 tracking-[0.25px] text-ink-text lg:text-[40px] lg:leading-[48px]">
                        Ready when you are
                    </h2>
                    <p className="font-geist mt-4 mb-0 text-[16px] leading-7 text-ink-text/70">
                        Book your next journey, or speak with our team about business travel.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <a
                            href="/#book"
                            className="font-geist inline-flex min-h-12 items-center justify-center rounded-full bg-wine-700 px-8 py-3 text-[16px] font-500 text-white transition hover:bg-wine-600"
                        >
                            Book a ride
                        </a>
                        <a
                            href="/business-solutions"
                            className="font-geist inline-flex min-h-12 items-center justify-center rounded-full border border-wine-700 px-8 py-3 text-[16px] font-500 text-wine-700 transition hover:bg-wine-50"
                        >
                            Business solutions
                        </a>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
