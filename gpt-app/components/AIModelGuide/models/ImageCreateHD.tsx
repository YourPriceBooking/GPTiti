"use client";

import { motion } from "framer-motion";

import ModelInputLimits from "@/components/common/ModelInputLimits/ModelInputLimits";

const ImageCreateHD = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      Image → Create HD is a high-quality AI image generator designed for
      detailed, realistic visuals. It transforms text into images with high
      precision, making it ideal for professional content, design, and
      marketing.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        How High-Quality AI Image Generation Works
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        The HD image generator uses advanced multimodal AI models that
        understand both language and visual structure. When you enter a prompt,
        the model analyzes:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Objects and context</li>
        <li>✔️ Lighting and composition</li>
        <li>✔️ Text placement (if needed)</li>
        <li>✔️ Visual style and realism</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        This results in highly accurate and visually rich images compared to
        fast-generation models.
      </p>
      <picture>
        <source srcSet="/img/ImageCreateHD/img-1.webp" type="image/webp" />
        <img
          src="/img/ImageCreateHD/img-1.jpg"
          alt="AI high quality image example"
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
        Advantages of Image → Create HD
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Maximum detail and image clarity</li>
        <li>✔️ Supports text rendering inside images</li>
        <li>✔️ Better understanding of complex prompts</li>
        <li>✔️ More realistic lighting, shadows, and depth</li>
      </ul>
      <picture>
        <source srcSet="/img/ImageCreateHD/img-2.webp" type="image/webp" />
        <img
          src="/img/ImageCreateHD/img-2.jpg"
          alt="Detailed AI generated design"
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
        Disadvantages
      </h2>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Higher cost per image</li>
        <li>Slightly slower generation</li>
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
        When to Use HD Image Generation
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Marketing visuals and ads</li>
        <li>✔️ Landing pages and SaaS products</li>
        <li>✔️ UI/UX mockups</li>
        <li>✔️ High-quality social media content</li>
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
        HD vs Fast Image Generation
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-gray-700 text-base border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 pr-6 font-semibold text-gray-900">Feature</th>
              <th className="py-2 pr-6 font-semibold text-gray-900">HD</th>
              <th className="py-2 font-semibold text-gray-900">Fast</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-2 pr-6">Quality</td>
              <td className="py-2 pr-6">Very high</td>
              <td className="py-2">Medium</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2 pr-6">Speed</td>
              <td className="py-2 pr-6">Medium</td>
              <td className="py-2">Very fast</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2 pr-6">Cost</td>
              <td className="py-2 pr-6">Higher (~12000 tokens)</td>
              <td className="py-2">Lower (~4000 tokens)</td>
            </tr>
            <tr>
              <td className="py-2 pr-6">Best for</td>
              <td className="py-2 pr-6">Design, marketing, UI</td>
              <td className="py-2">Drafts, quick ideas</td>
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
        Why GPTiti Image Generator is Different
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Unlike raw API tools, GPTiti provides a simplified interface for AI
        image generation. You don't need to manage models or settings — just
        describe your idea and get results.
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ No setup required</li>
        <li>✔️ Optimized cost control</li>
        <li>✔️ Integrated with chat and AI tools</li>
      </ul>
      <picture>
        <source srcSet="/img/ImageCreateHD/img-3.webp" type="image/webp" />
        <img
          src="/img/ImageCreateHD/img-3.jpg"
          alt="Realistic AI image with text"
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
        1 image ≈ <span className="font-semibold">12000 tokens</span>*
      </p>
      <p className="text-gray-500 text-sm leading-relaxed">
        *Actual usage depends on prompt complexity and image size.
      </p>
    </motion.div>

    <hr className="border-gray-200" />

    <ModelInputLimits model="Image → Create HD" />
  </>
);

export default ImageCreateHD;
