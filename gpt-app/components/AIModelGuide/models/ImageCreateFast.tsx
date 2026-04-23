"use client";

import { motion } from "framer-motion";

const ImageCreateFast = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      Image → Create Fast is designed for speed and efficiency. It allows you to
      generate images instantly while keeping costs low — perfect for everyday
      use.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        How Fast Image Generation Works
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Fast mode uses a lighter AI model optimized for speed. It simplifies
        image generation by focusing on basic structure instead of deep detail.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        This allows near-instant generation but reduces accuracy and realism
        compared to HD mode.
      </p>
      <picture>
        <source srcSet="/img/ImageCreateFast/img-1.webp" type="image/webp" />
        <img
          src="/img/ImageCreateFast/img-1.jpg"
          alt="Fast AI image example"
          width={800}
          height={450}
          loading="lazy"
          className="w-full rounded-lg object-cover"
        />
      </picture>
    </motion.div>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        Advantages of Image → Create Fast
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Very fast generation speed</li>
        <li>✔️ Lower cost per image</li>
        <li>✔️ Efficient for frequent usage</li>
        <li>✔️ Ideal for rapid testing</li>
      </ul>
    </motion.div>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        Disadvantages
      </h2>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Lower detail and realism</li>
        <li>Limited text rendering quality</li>
        <li>Less accurate results for complex prompts</li>
      </ul>
    </motion.div>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        When to Use Fast Image Generation
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Quick drafts</li>
        <li>✔️ Concept testing</li>
        <li>✔️ Blog images</li>
        <li>✔️ Everyday content</li>
      </ul>
      <picture>
        <source srcSet="/img/ImageCreateFast/img-2.webp" type="image/webp" />
        <img
          src="/img/ImageCreateFast/img-2.jpg"
          alt="Simple AI illustration"
          width={800}
          height={450}
          loading="lazy"
          className="w-full rounded-lg object-cover"
        />
      </picture>
    </motion.div>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        Fast vs HD Image Generation
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-gray-700 text-base border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 pr-6 font-semibold text-gray-900">Feature</th>
              <th className="py-2 pr-6 font-semibold text-gray-900">Fast</th>
              <th className="py-2 font-semibold text-gray-900">HD</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-2 pr-6">Speed</td>
              <td className="py-2 pr-6">Very fast</td>
              <td className="py-2">Medium</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2 pr-6">Quality</td>
              <td className="py-2 pr-6">Medium</td>
              <td className="py-2">Very high</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2 pr-6">Cost</td>
              <td className="py-2 pr-6">Low (~4000 tokens)</td>
              <td className="py-2">High (~12000 tokens)</td>
            </tr>
            <tr>
              <td className="py-2 pr-6">Best for</td>
              <td className="py-2 pr-6">Drafts</td>
              <td className="py-2">Final visuals</td>
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        Why Use Fast Mode
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Fast mode is perfect when you need speed over perfection. It allows you
        to iterate quickly and generate multiple ideas without high cost.
      </p>
      <picture>
        <source srcSet="/img/ImageCreateFast/img-3.webp" type="image/webp" />
        <img
          src="/img/ImageCreateFast/img-3.jpg"
          alt="Quick AI generated concept"
          width={800}
          height={450}
          loading="lazy"
          className="w-full rounded-lg object-cover"
        />
      </picture>
    </motion.div>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">Pricing</h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        1 image ≈ <span className="font-semibold">4000 tokens</span>*
      </p>
      <p className="text-gray-500 text-sm leading-relaxed">
        *Actual usage depends on prompt complexity.
      </p>
    </motion.div>
  </>
);

export default ImageCreateFast;
