import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

export default function Pricing() {
    return (
        <section className="py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-6">
                <div className="max-w-md space-y-6">
                    <h1 className="text-muted-foreground text-balance text-4xl font-medium tracking-tight lg:text-5xl">
                        <span className="text-foreground">Start free.</span> <br /> Upgrade as you scale.
                    </h1>
                </div>

                <div className="mt-12 grid gap-6 max-lg:mx-auto max-lg:max-w-sm lg:mt-20 lg:grid-cols-3">
                    <div className="flex flex-col gap-8 rounded-3xl bg-white p-8 shadow-sm">
                        <div>
                            <p className="text-[#0e0f0c] text-lg font-medium">Starter</p>
                            <p className="text-[#868685] text-lg font-medium">For solo developers</p>

                            <div className="my-8 block text-4xl font-display font-black tracking-tight text-[#0e0f0c]">
                                $0 <span className="text-[#868685] text-lg font-normal">/mo</span>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full rounded-full"
                                nativeButton={false}
                                render={<Link href="#">Get Started</Link>}
                            />
                        </div>

                        <ul className="text-[#454745] list-outside space-y-3">
                            {['Basic Analytics Dashboard', '5GB Cloud Storage', 'Email and Chat Support'].map((item, index) => (
                                <li
                                    key={index}
                                    className="flex items-center gap-3"
                                >
                                    <Check className="text-[#2ead4b] size-3" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-[#0e0f0c] text-[#9fe870] relative flex flex-col gap-8 shadow-xl rounded-3xl p-8">
                        <div className="inset-ring inset-ring-foreground/10 absolute right-0 top-0 w-fit -translate-y-px translate-x-px rounded-bl-xl bg-[#e2f6d5] px-3 py-1 text-xs font-medium text-[#054d28] [corner-shape:bevel]">Popular</div>
                        <div>
                            <p className="text-[#9fe870] text-lg font-medium">Pro</p>
                            <p className="text-[#e8ebe6] text-lg font-medium">For ambitious founders</p>

                            <div className="my-8 block text-4xl font-display font-black tracking-tight text-[#9fe870]">
                                $59 <span className="text-[#e8ebe6] text-lg font-normal">/mo</span>
                            </div>

                            <Button
                                className="w-full rounded-full bg-[#9fe870] text-[#0e0f0c]"
                                nativeButton={false}
                                render={<Link href="#">Get Started</Link>}
                            />
                        </div>

                        <ul className="text-[#e8ebe6] list-outside space-y-3">
                            {['Everything in Free Plan', '5GB Cloud Storage', 'Email and Chat Support', 'Access to Community Forum', 'Single User Access', 'Access to Basic Templates', 'Mobile App Access', '1 Custom Report Per Month', 'Monthly Product Updates', 'Standard Security Features'].map((item, index) => (
                                <li
                                    key={index}
                                    className="flex items-center gap-3"
                                >
                                    <Check className="text-[#9fe870] size-3" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-8 rounded-3xl bg-white p-8 shadow-sm">
                        <div>
                            <p className="text-[#0e0f0c] text-lg font-medium">Startup</p>
                            <p className="text-[#868685] text-lg font-medium">For growing businesses and teams</p>

                            <div className="my-8 block text-4xl font-display font-black tracking-tight text-[#0e0f0c]">
                                $99 <span className="text-[#868685] text-lg font-normal">/mo</span>
                            </div>

                            <Button
                                className="w-full rounded-full"
                                variant="outline"
                                nativeButton={false}
                                render={<Link href="#">Get Started</Link>}
                            />
                        </div>

                        <ul className="text-[#454745] list-outside space-y-3">
                            {['Everything in Pro Plan', '10GB Cloud Storage', 'Email and Chat Support', 'Access to Community Forum', 'Single User Access', 'Access to Basic Templates', 'Mobile App Access', '1 Custom Report Per Month', 'Monthly Product Updates', 'Standard Security Features'].map((item, index) => (
                                <li
                                    key={index}
                                    className="flex items-center gap-3"
                                >
                                    <Check className="text-[#2ead4b] size-3" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}
